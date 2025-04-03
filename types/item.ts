// types/item.ts
export interface Item {
    id: string;
    title: string;
    body: string;
    userId: number;
  }
  
  export interface ItemFormValues {
    title: string;
    body: string;
    userId: number;
  }