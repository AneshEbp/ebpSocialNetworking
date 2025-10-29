import express from "express";
import Handlebars from "handlebars";
import TemplateModel from "../models/template.model.js";
import { AsyncResource } from "async_hooks";
export const uploadTemplate = async (req, res) => {
    try {
        const { templateName, templateContent } = req.body;
        if (!templateName || !templateContent) {
            return res.status(400).send("Template name and content are required");
        }
        const compiledTemplate = Handlebars.precompile(templateContent);
        const newTemplate = new TemplateModel({
            name: templateName,
            content: compiledTemplate,
        });
        await newTemplate.save();
        res.status(201).send("Template uploaded successfully");
    }
    catch (err) {
        console.error("Error uploading template:", err);
        return res.status(500).send("Internal server error");
    }
};
export const deleteTemplate = async (req, res) => {
    try {
        const { templateId } = req.body;
        if (!templateId) {
            return res.status(400).send("Template ID is required");
        }
        await TemplateModel.findByIdAndDelete(templateId);
        res.status(200).send("Template deleted successfully");
    }
    catch (err) {
        console.error("Error deleting template:", err);
        return res.status(500).send("Internal server error");
    }
};
export const getTemplatebyId = async (req, res) => {
    try {
        const { templateId } = req.params;
        const template = await TemplateModel.findById(templateId);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        res.status(200).json(template);
    }
    catch (err) {
        console.error("Error fetching template:", err);
        return res.status(500).send("Internal server error");
    }
};
export const getAllTemplates = async (req, res) => {
    try {
        const templates = await TemplateModel.find();
        res.status(200).json(templates);
    }
    catch (err) {
        console.error("Error fetching all templates:", err);
        return res.status(500).send("Internal server error");
    }
};
export const getTemplateByName = async (name) => {
    try {
        const templateName = name;
        const template = await TemplateModel.findOne({ name: templateName });
        return template;
    }
    catch (err) {
        console.error("Error fetching template by name:", err);
        return null;
    }
};
//# sourceMappingURL=hbsTemplate.controller.js.map