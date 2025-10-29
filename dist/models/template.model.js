import mongoose from "mongoose";
const templateSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    content: { type: String, required: true },
});
const TemplateModel = mongoose.model("Template", templateSchema);
export default TemplateModel;
//# sourceMappingURL=template.model.js.map