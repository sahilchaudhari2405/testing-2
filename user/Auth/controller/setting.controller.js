import cloudinary from 'cloudinary';
import InvoiceSettingsSchema from '../model/setting.js';
import { getTenantModel } from '../database/getTenantModel.js';




// Create Invoice Settings
// Create or Update Invoice Settings
export const createInvoiceSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const InvoiceSettings = await getTenantModel(tenantId, "InvoiceSettings", InvoiceSettingsSchema);

    // Check if settings already exist
    const existingSettings = await InvoiceSettings.findOne();

    const data = { ...req.body }; // Take the incoming request body

    if (existingSettings) {
      // If settings exist, update them with the new data
      existingSettings.set(data); // Updates the fields with the new data
      await existingSettings.save();

      // Exclude _id from the response
      const settingsWithoutId = existingSettings.toObject();
      delete settingsWithoutId._id;

      return res.status(200).json({
        success: true,
        message: 'Invoice settings updated successfully!',
        data: settingsWithoutId,
      });
    } else {
      // If settings don't exist, create new settings
      const newSettings = new InvoiceSettings(data);
      await newSettings.save();

      // Exclude _id from the response
      const newSettingsWithoutId = newSettings.toObject();
      delete newSettingsWithoutId._id;
      delete newSettingsWithoutId.updatedAt;
      delete newSettingsWithoutId.__v;
      return res.status(201).json({
        success: true,
        message: 'Invoice settings created successfully!',
        data: newSettingsWithoutId,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};

// Get Invoice Settings
export const getInvoiceSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const InvoiceSettings = await getTenantModel(tenantId, "InvoiceSettings", InvoiceSettingsSchema);

    // Fetch the only existing settings
    const settings = await InvoiceSettings.findOne(); // Only one entry exists

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Invoice settings not found',
      });
    }

    // Exclude _id from the response
    const settingsWithoutId = settings.toObject();
    delete settingsWithoutId._id;
    delete settingsWithoutId.updatedAt;
    delete settingsWithoutId.__v;

    res.status(200).json({
      success: true,
      data: settingsWithoutId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};


// Update Invoice Settings by ID
export const updateInvoiceSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body } = req;

    // Handle logo update if present
    let logoUrl = body.Logo;
    const tenantId =req.user.tenantId
    const InvoiceSettings = await getTenantModel(tenantId, "InvoiceSettings",InvoiceSettingsSchema );
    if (file) {
      const logoUpload = await cloudinary.uploader.upload(file.path, {
        folder: 'invoice-logos',
      });
      logoUrl = logoUpload.secure_url;
    }

    const data = { ...body, Logo: logoUrl };

    const updatedSettings = await InvoiceSettings.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedSettings) {
      return res.status(404).json({
        success: false,
        message: 'Invoice settings not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice settings updated successfully!',
      data: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};

// Delete Invoice Settings by ID
export const deleteInvoiceSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId =req.user.tenantId
    const InvoiceSettings = await getTenantModel(tenantId, "InvoiceSettings",InvoiceSettingsSchema );
    const deletedSettings = await InvoiceSettings.findByIdAndDelete(id);

    if (!deletedSettings) {
      return res.status(404).json({
        success: false,
        message: 'Invoice settings not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice settings deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};
