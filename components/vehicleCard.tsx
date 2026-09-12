"use client";
import React from "react";
import { IVehicle } from "@/models/vehicle.model";
import { motion } from "motion/react";
import { Bike, Car, Star, Truck } from "lucide-react";

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  tuck: { label: "Truck", Icon: Truck },
};

function VehicleCard({
  vehicle,
  distance,
}: {
  vehicle: IVehicle;
  distance: number | undefined;
}) {
  const { Icon, label } = VEHICLE_META[vehicle.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.06,
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative bg-white border border-zinc-200 
      rounded-3xl overflow-hidden flex flex-group cursor-default"
    >
      <div className="relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.img
          src={vehicle.imageUrl}
          alt={vehicle.vehicleModel}
          className="relative z-10 h-auto w-auto object-contain"
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.14))" }}
          whileHover={{
            scale: 1.05,
            filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.22))",
          }}
          transition={{ duration: 0.3 }}
        />
        <div
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 
        bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full
        "
        >
          <Icon size={10} />
          {label}
        </div>
        <div
          className="absolute bottom-3 left-3 z-20 flex items-center gap-1
        bg-white border border-zinc-200 px-2.5 py-1.5 rounded-full text-zinc-700 text-[10px] font-bold shadow-sm"
        >
          <Star size={10} className="fill-zinc-900 text-zinc-900" />
          4.8
        </div>
      </div>
      <div className="h-px bg-zinc-100" />

      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-zinc-900 text-base font-black tracking-tight leading-tight truncate">{vehicle.vehicleModel}</h3>
            <div className="mt-1.5 inline-flex items-center bg-zinc-1000 px-2.5 py-1 rounded-lg border border-zinc-200">
              <span className="text-zinc-500 text-xs font-black tracking-[0.2em] font-mono uppercase">
                {vehicle.number}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-2 flex items-center justify-center">
            <Icon size={17} className="text-zinc-700" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VehicleCard;
