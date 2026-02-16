export interface DataItem {
  readonly id: string;
  readonly saleDate: string;
  readonly category: "Monitors" | "Laptops" | "Gaming" | "PC Accessories" | "Software";
  readonly name: string;
  readonly quantity: number;
  readonly price: number;
  readonly status: "Delivered" | "Dispatched" | "Delayed";
  readonly total: number;
}

// prettier-ignore
export const data: DataItem[] = [
  { "id": "PRD001", "category": "Software", "name": "Office Suite", "quantity": 88, "price": 340, "status": "Delivered", "saleDate": "2024-09-26" },
  { "id": "PRD002", "category": "Monitors", "name": "Curved 49\"", "quantity": 18, "price": 354, "status": "Delivered", "saleDate": "2025-01-25" },
  { "id": "PRD003", "category": "PC Accessories", "name": "Wireless Mouse", "quantity": 62, "price": 1199, "status": "Delivered", "saleDate": "2024-11-15" },
  { "id": "PRD004", "category": "Laptops", "name": "Workstation Pro", "quantity": 27, "price": 165, "status": "Delivered", "saleDate": "2025-01-09" },
  { "id": "PRD005", "category": "Monitors", "name": "Curved 49\"", "quantity": 86, "price": 2079, "status": "Dispatched", "saleDate": "2024-10-07" },
  { "id": "PRD006", "category": "Software", "name": "Design Pro", "quantity": 79, "price": 305, "status": "Delayed", "saleDate": "2025-01-20" },
  { "id": "PRD007", "category": "PC Accessories", "name": "Webcam HD", "quantity": 23, "price": 951, "status": "Delivered", "saleDate": "2024-09-16" },
  { "id": "PRD008", "category": "Software", "name": "Design Pro", "quantity": 78, "price": 343, "status": "Delayed", "saleDate": "2024-09-25" },
  { "id": "PRD009", "category": "Software", "name": "Cloud Backup", "quantity": 97, "price": 167, "status": "Delayed", "saleDate": "2024-12-30" },
  { "id": "PRD010", "category": "Gaming", "name": "Controller Pro", "quantity": 84, "price": 1732, "status": "Delayed", "saleDate": "2024-08-28" },
  { "id": "PRD011", "category": "Laptops", "name": "ThinkPro X1", "quantity": 50, "price": 653, "status": "Delivered", "saleDate": "2024-10-24" },
  { "id": "PRD012", "category": "PC Accessories", "name": "Wireless Mouse", "quantity": 29, "price": 1471, "status": "Dispatched", "saleDate": "2024-10-17" },
  { "id": "PRD013", "category": "Monitors", "name": "UltraWide 34\"", "quantity": 49, "price": 1723, "status": "Delivered", "saleDate": "2025-02-12" },
  { "id": "PRD014", "category": "PC Accessories", "name": "Ergonomic Keyboard", "quantity": 75, "price": 686, "status": "Delivered", "saleDate": "2024-08-30" },
  { "id": "PRD015", "category": "PC Accessories", "name": "Bluetooth Speaker", "quantity": 96, "price": 364, "status": "Delivered", "saleDate": "2024-09-19" },
  { "id": "PRD016", "category": "PC Accessories", "name": "Wireless Mouse", "quantity": 13, "price": 1153, "status": "Delivered", "saleDate": "2024-11-19" },
  { "id": "PRD017", "category": "Monitors", "name": "Gaming 27\"", "quantity": 1, "price": 1927, "status": "Dispatched", "saleDate": "2025-01-20" },
  { "id": "PRD018", "category": "Gaming", "name": "Gaming Headset", "quantity": 87, "price": 1698, "status": "Delivered", "saleDate": "2025-01-25" },
  { "id": "PRD019", "category": "Software", "name": "Design Pro", "quantity": 85, "price": 231, "status": "Dispatched", "saleDate": "2024-12-26" },
  { "id": "PRD020", "category": "PC Accessories", "name": "Webcam HD", "quantity": 63, "price": 1156, "status": "Delivered", "saleDate": "2024-08-29" },
  { "id": "PRD021", "category": "PC Accessories", "name": "Wireless Mouse", "quantity": 85, "price": 1440, "status": "Delayed", "saleDate": "2024-11-01" },
  { "id": "PRD022", "category": "Laptops", "name": "ThinkPro X1", "quantity": 40, "price": 857, "status": "Delayed", "saleDate": "2024-12-14" },
  { "id": "PRD023", "category": "Gaming", "name": "Controller Pro", "quantity": 37, "price": 1516, "status": "Delivered", "saleDate": "2024-09-11" },
  { "id": "PRD024", "category": "Software", "name": "Developer IDE", "quantity": 30, "price": 92, "status": "Delayed", "saleDate": "2024-09-14" },
  { "id": "PRD025", "category": "Software", "name": "Cloud Backup", "quantity": 44, "price": 190, "status": "Delayed", "saleDate": "2024-10-14" },
  { "id": "PRD026", "category": "Gaming", "name": "Gaming Mouse", "quantity": 26, "price": 557, "status": "Dispatched", "saleDate": "2024-09-15" },
  { "id": "PRD027", "category": "Gaming", "name": "Gaming Mouse", "quantity": 81, "price": 673, "status": "Delayed", "saleDate": "2025-01-02" },
  { "id": "PRD028", "category": "PC Accessories", "name": "Ergonomic Keyboard", "quantity": 14, "price": 1343, "status": "Delayed", "saleDate": "2025-01-20" },
  { "id": "PRD029", "category": "Laptops", "name": "Gaming Elite", "quantity": 75, "price": 495, "status": "Dispatched", "saleDate": "2025-02-14" },
  { "id": "PRD030", "category": "Monitors", "name": "4K Display 32\"", "quantity": 68, "price": 1309, "status": "Delayed", "saleDate": "2024-10-01" },
  { "id": "PRD031", "category": "Software", "name": "Cloud Backup", "quantity": 22, "price": 81, "status": "Delivered", "saleDate": "2024-08-20" },
  { "id": "PRD032", "category": "Software", "name": "Cloud Backup", "quantity": 4, "price": 136, "status": "Delivered", "saleDate": "2024-11-25" },
  { "id": "PRD033", "category": "Software", "name": "Design Pro", "quantity": 47, "price": 186, "status": "Delivered", "saleDate": "2024-09-26" },
  { "id": "PRD034", "category": "Software", "name": "Developer IDE", "quantity": 86, "price": 128, "status": "Delayed", "saleDate": "2024-12-18" },
  { "id": "PRD035", "category": "Laptops", "name": "ThinkPro X1", "quantity": 50, "price": 1200, "status": "Delayed", "saleDate": "2024-12-07" },
  { "id": "PRD036", "category": "PC Accessories", "name": "Ergonomic Keyboard", "quantity": 83, "price": 217, "status": "Delivered", "saleDate": "2024-12-21" },
  { "id": "PRD037", "category": "Software", "name": "Design Pro", "quantity": 53, "price": 280, "status": "Delivered", "saleDate": "2024-10-27" },
  { "id": "PRD038", "category": "Gaming", "name": "Gaming Mouse", "quantity": 66, "price": 1726, "status": "Delivered", "saleDate": "2024-12-16" },
  { "id": "PRD039", "category": "Gaming", "name": "Gaming Headset", "quantity": 71, "price": 1545, "status": "Dispatched", "saleDate": "2024-12-29" },
  { "id": "PRD040", "category": "Monitors", "name": "Professional 28\"", "quantity": 56, "price": 834, "status": "Delivered", "saleDate": "2024-11-25" },
  { "id": "PRD041", "category": "Software", "name": "Antivirus Plus", "quantity": 70, "price": 234, "status": "Dispatched", "saleDate": "2024-12-11" },
  { "id": "PRD042", "category": "PC Accessories", "name": "Ergonomic Keyboard", "quantity": 57, "price": 292, "status": "Delayed", "saleDate": "2025-01-28" },
  { "id": "PRD043", "category": "PC Accessories", "name": "Wireless Mouse", "quantity": 26, "price": 1105, "status": "Delivered", "saleDate": "2024-11-21" },
  { "id": "PRD044", "category": "Gaming", "name": "Gaming Chair", "quantity": 20, "price": 815, "status": "Delivered", "saleDate": "2024-09-12" },
  { "id": "PRD045", "category": "PC Accessories", "name": "Ergonomic Keyboard", "quantity": 61, "price": 1470, "status": "Delayed", "saleDate": "2024-08-19" },
  { "id": "PRD046", "category": "Software", "name": "Cloud Backup", "quantity": 86, "price": 160, "status": "Dispatched", "saleDate": "2024-09-25" },
  { "id": "PRD047", "category": "Software", "name": "Design Pro", "quantity": 72, "price": 335, "status": "Delivered", "saleDate": "2024-10-01" },
  { "id": "PRD048", "category": "Software", "name": "Antivirus Plus", "quantity": 45, "price": 171, "status": "Delayed", "saleDate": "2024-08-18" },
  { "id": "PRD049", "category": "Software", "name": "Design Pro", "quantity": 4, "price": 259, "status": "Delivered", "saleDate": "2024-12-14" },
  { "id": "PRD050", "category": "Laptops", "name": "Workstation Pro", "quantity": 86, "price": 408, "status": "Delivered", "saleDate": "2024-11-21" }
].map(x => ({ ...x, total: x.price * x.quantity } as DataItem))
