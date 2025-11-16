# 🔴 CRITICAL: Backend Performance Issue - N+1 Query Problem

## 📊 Issue Summary

**Endpoint:** `GET /exam/v1/matrices`  
**Current Loading Time:** 10+ seconds  
**Expected Loading Time:** < 1 second  
**Root Cause:** N+1 Query Problem when populating `MatrixDetail.topicName`

## 🐛 Problem Description

When fetching exam matrices, the ExamService is making **hundreds of individual HTTP requests** to SlidesService to get topic names:

```
Request 1: GET /exam/v1/matrices
  ↳ Request 2: GET /slides/v1/topics/e3d75233-297d-4d9f-b083-0e5a10685543
  ↳ Request 3: GET /slides/v1/topics/19cc4543-8674-4776-b7fc-0bdf94a9c708
  ↳ Request 4: GET /slides/v1/topics/5290b381-f277-4456-96ab-eace8a585e15
  ↳ ... (100+ more requests)
```

### Observed Behavior:
- Ocelot Gateway logs show ~100+ requests to `/slides/v1/topics/{id}`
- Each request takes ~50-100ms
- Total time: 10+ seconds
- Same topic IDs are fetched multiple times (no caching)

## 📋 Evidence

### API Response Structure
The `/slides/v1/topics` endpoint **already returns all required data**:

```json
{
  "success": true,
  "data": [
    {
      "id": "e3d75233-297d-4d9f-b083-0e5a10685543",
      "name": "Cấu tạo nguyên tử",
      "gradeName": "Lớp 10",
      "gradeId": "f7eba72e-d8d7-4cf6-abec-f9c853a655f1"
    }
  ]
}
```

### Current Backend Code (Suspected)
```csharp
// ❌ WRONG: N+1 Query Problem
foreach (var detail in matrix.MatrixDetails) 
{
    // This calls SlidesService for EACH detail!
    var topic = await _slidesService.GetTopicById(detail.TopicId);
    detail.TopicName = topic.Name;
}
```

## ✅ Recommended Solution

### Option 1: Batch Fetch (Recommended)
```csharp
// ✅ CORRECT: Single API call
public async Task<List<MatrixDto>> GetAllMatrices()
{
    var matrices = await _repository.GetAllMatrices();
    
    // Get all unique topic IDs
    var topicIds = matrices
        .SelectMany(m => m.MatrixDetails)
        .Select(d => d.TopicId)
        .Distinct()
        .ToList();
    
    // Single call to get all topics
    var topics = await _slidesService.GetAllTopics();
    var topicDict = topics.ToDictionary(t => t.Id, t => t);
    
    // Map in-memory
    foreach (var matrix in matrices)
    {
        foreach (var detail in matrix.MatrixDetails)
        {
            detail.TopicName = topicDict.TryGetValue(detail.TopicId, out var topic) 
                ? topic.Name 
                : "Unknown Topic";
        }
    }
    
    return matrices;
}
```

### Option 2: Caching
```csharp
// Add distributed caching for topics
private readonly IDistributedCache _cache;

public async Task<Topic> GetTopicById(Guid topicId)
{
    var cacheKey = $"topic:{topicId}";
    
    // Try cache first
    var cached = await _cache.GetStringAsync(cacheKey);
    if (cached != null)
    {
        return JsonSerializer.Deserialize<Topic>(cached);
    }
    
    // Fetch from SlidesService
    var topic = await _slidesService.GetTopicById(topicId);
    
    // Cache for 5 minutes
    await _cache.SetStringAsync(
        cacheKey, 
        JsonSerializer.Serialize(topic),
        new DistributedCacheEntryOptions 
        { 
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) 
        }
    );
    
    return topic;
}
```

### Option 3: Database JOIN (Best for long-term)
```csharp
// If SlidesService and ExamService share database
// Use JOIN instead of separate calls
var matrices = await _context.Matrices
    .Include(m => m.MatrixDetails)
        .ThenInclude(d => d.Topic) // Direct JOIN
    .ToListAsync();
```

## 🎯 Frontend Workaround (Temporary)

Frontend has implemented **client-side caching** to mitigate the issue:
- ✅ localStorage cache with 5-minute TTL
- ✅ Cache invalidation on matrix creation
- ✅ Loading indicators with performance warnings
- ⚠️ This is a **temporary solution** - backend must be fixed!

## 📈 Expected Performance Gain

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| API Calls | 100+ | 1-2 | **98% reduction** |
| Loading Time | 10s | <1s | **10x faster** |
| Server Load | High | Low | Significantly reduced |

## 🔧 Implementation Checklist

- [ ] Identify the exact location in ExamService making individual topic calls
- [ ] Implement batch fetching using `GetAllTopics()`
- [ ] Test with real data (20+ matrices with 5+ topics each)
- [ ] Measure performance improvement
- [ ] (Optional) Add Redis caching for topic dictionary
- [ ] Update API documentation

## 📞 Contact

If you need frontend team's assistance testing the fix, please contact us via:
- GitHub Issues
- Team Slack Channel

---

**Priority:** 🔴 HIGH  
**Impact:** Critical performance issue affecting all users  
**Effort:** Low (1-2 hours)  
**Created:** November 16, 2025
