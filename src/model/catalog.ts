import { Schema } from "mongoose"
import {mongoose} from "../infrastructure/provider/database"


const catalogSchema = new mongoose.Schema<IEquipmentCatalog>({
    additionalDetails: Schema.Types.Mixed,
    sellerReferenceId: { type: String, required: [true, "Required"] },
    title: { type: String, required: [true, "Required"] },
    mediaContainer: { type: String, required: [true, "Required"] },
    availabilityStartDate: { type: Date, required: [true, "Required"] },
    equipmentRentPrice: { type: Number, required: [true, "Required"] },
    isOperatorAvailable: { type: Boolean, default: false },
    operatorPrice: { type: Number },
    operatorCount: { type: Number },
    description: { type: String, required: [true, "Required"] },
    catalogType: { type: String, required: [true, "Required"] },
    quantity: { type: Number, required: [true, "Required"] }
},{ strict: false })


catalogSchema.methods.RemoveStock = function (requiredStock: number) {
    const removed = Math.min(this.quantity, requiredStock);
    this.quantity -= removed;
};


interface Icatalog{
    sellerReferenceId: string,
    catalogType: string,
    title: string,
    description: string,
    availabilityStartDate: Date,
    mediaContainer: string,
    additionalDetails: IadditionalDetails,
    quantity: number,
    removeStock(requiredStock: number):number   
}

interface IEquipmentCatalog extends Icatalog  {
    equipmentRentPrice: number,
    isOperatorAvailable: boolean,
    operatorPrice: Number,
    operatorCount: Number
}

interface IadditionalDetails{
    [name:string]:string
}

const catalog = mongoose.model<IEquipmentCatalog>('catalog', catalogSchema);

export { catalog, Icatalog,IadditionalDetails, IEquipmentCatalog};