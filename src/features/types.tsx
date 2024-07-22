export interface TagState {
    add: boolean;
    id: string;
    title: string;
    url: string;
    category: string;
  }
  
export interface RootState {
    tag: TagState;
}
  