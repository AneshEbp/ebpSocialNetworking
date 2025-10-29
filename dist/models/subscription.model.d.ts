import mongoose from "mongoose";
declare const Subscription: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    startDate: NativeDate;
    endDate: NativeDate;
    status: "active" | "inactive";
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Subscription;
//# sourceMappingURL=subscription.model.d.ts.map