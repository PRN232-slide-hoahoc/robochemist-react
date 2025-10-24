import { axiosInstance } from '../api/axios.config';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { User, CreateUserDto, UpdateUserDto } from '@/types/models.types';
import { endpoints } from '../api/endpoints';

class UserService {
  async getUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      endpoints.users.list,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      endpoints.users.byId(id)
    );
    return response.data.data;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      endpoints.users.create,
      data
    );
    return response.data.data;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      endpoints.users.update(id),
      data
    );
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(endpoints.users.delete(id));
  }
}

export const userService = new UserService();

