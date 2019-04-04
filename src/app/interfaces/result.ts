import Partner from "./partners";
import Partnership from "./partnership";

export interface ResultPartner {
  count: number
  next: string
  previous: string
  results: Partner[]
}

export interface ResultPartnership {
  count: number
  next: string
  previous: string
  results: Partnership[]
}