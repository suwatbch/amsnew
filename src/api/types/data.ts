export interface BillItem {
    BillName: string;
    Price: string;
    Quantity?: number;
    Description?: string;
  }
  
  export interface BillData {
    ID: number;
    Roomid: number;
    date: string | null;
    billnameData: BillItem[];
    BilledToName?: string;
    BilledToContact?: string;
    BilledToAddress?: string;
    BilledToCity?: string;
    BilledToPhone?: string;
    ShippedToAddress?: string;
    ShippedToCity?: string;
    ShippedToPhone?: string;
  }
  