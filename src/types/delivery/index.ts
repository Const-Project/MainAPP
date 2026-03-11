export interface DeliverablePlant {
  seedType: number;
  imageUrl: string;
  name: string;
}

export interface CreateSeedDeliveryRequest {
  seedType: number;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  message?: string;
}
