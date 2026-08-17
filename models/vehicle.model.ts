import mongoose, { mongo } from "mongoose";

type vehicleType = "bike" | "car" | "loading" | "truck" | "auto";

export interface IVehicle {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imgeUrl?: string;
  baseFarer?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["bike", "truck", "car", "loading", "auto"],
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    imgeUrl: String,
    baseFarer: Number,
    pricePerKM: Number,
    waitingCharge: Number,
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    rejectionReason: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle",vehicleSchema);
export default Vehicle
