import { axiosInstance } from '../api/axios.config';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { User, CreateUserDto, UpdateUserDto } from '@/types/models.types';
import { endpoints } from '../api/endpoints';

class UserService {
  async getUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      // Use AUTH.PUBLIC as a generic users listing endpoint
      endpoints.AUTH.PUBLIC,
      { params: { pageNumber: page, pageSize } }
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      endpoints.AUTH.BY_ID(id)
    );
    return response.data.data;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      // Register endpoint
      endpoints.AUTH.REGISTER,
      data
    );
    return response.data.data;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      endpoints.AUTH.BY_ID(id),
      data
    );
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(endpoints.AUTH.BY_ID(id));
  }
}

export const userService = new UserService();

