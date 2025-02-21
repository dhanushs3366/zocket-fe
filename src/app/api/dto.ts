export interface ApiResult<T> {
    success: boolean;
    result: T; // Generic type
    err: string;
  }

  export interface DefaultModel {
    ID: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null; 
  }

  export enum TaskStatus {
    Todo = "todo",
    InProgress = "pending",
    Completed = "completed",
  }
  
  export interface Task extends DefaultModel {
    title?: string;
    description?: string;
    status?: TaskStatus;
    users?: UserDetails[]; 
  }


  export interface UserDetails extends DefaultModel {
    name: string;
    username: string;
    email: string;
    tasks?: Task[]; 
  }


  export interface UserForm {
    name?:string;
    username:string;
    email?:string;
    password:string; // only for login and register
  }