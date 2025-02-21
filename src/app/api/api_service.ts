import axios, { AxiosInstance } from "axios";
import { ApiResult, Task, UserDetails, UserForm } from "./dto";

const API_BASE_URL = process.env.API_URL || "http://127.0.0.1:8080";
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  async login(user: UserForm): Promise<ApiResult<UserDetails>> {
    try {
      const response = await this.api.post<ApiResult<UserDetails>>(
        "/login",
        user
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to fetch students"
        );
      }
      throw err;
    }
  }
  
  

  async register(user: UserForm): Promise<ApiResult<string>> {
    try {
      const response = await this.api.post<ApiResult<string>>(
        "/register",
        user
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to fetch students"
        );
      }
      throw err;
    }
  }


  async getAllTasks():Promise<ApiResult<Task[]>>{
    try{
      const response=await this.api.get("/users/tasks")
      return response.data
    }catch(err){
      console.log(err)
      throw err
    }
  }

  async updateTask(taskID:number,task:Task):Promise<ApiResult<string>>{
    try{
      const res=await this.api.patch<ApiResult<string>>(`/users/tasks?id=${taskID}`,task)
      
      return res.data
    }catch(err){
      console.log(err)
      throw err
    }
  }
}

export const apiService = new ApiService();
