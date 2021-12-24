const logger = require('../config/logger');
const { leanArray } = require('../utils/helpers/api.helper');
const Prescription = require('../models/prescription.model');
const UserService = require('../services/user.service');

const createPrescription = async (createData, user) => {
  try {
    // check user is doctor or not
    if (user.role !== 'doctor') {
      throw {
        status: 400,
        message: 'unauthorized for people have no doctor role',
      };
    }

    const { user: member } = await UserService.getUserInfoById({
      userId: createData.member.toString(),
    });
    const { user: doctor } = await UserService.getUserInfoById({
      userId: createData.doctor.toString(),
    });

    // logger.Info(member);
    if (member.role !== 'member' || doctor.role !== 'doctor') {
      throw {
        status: 400,
        message: 'member or doctor is not properly authorized',
      };
    }

    createData['date'] = createData.date
      ? new Date(createData.date * 1000)
      : new Date();

    const prescription = Prescription(createData);
    await prescription.save();

    return { prescriptionId: prescription._id.toString() };
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const getPrescriptionByMe = async (user) => {
  try {
    if (user.role === 'member') {
      const prescription = await Prescription.find({
        member: user._id,
        isDeleted: false,
      }).lean();
      return { prescriptions: leanArray(prescription) };
    } else if (user.role === 'doctor') {
      const prescription = await Prescription.find({
        doctor: user._id,
        isDeleted: false,
      }).lean();
      return { prescriptions: leanArray(prescription) };
    }

    const prescription = await Prescription.find({}).lean();
    return { prescriptions: leanArray(prescription) };
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const updatePrescription = async (id, updateFields, updateData, user) => {
  try {
    // check user is doctor or not
    if (user.role !== 'doctor') {
      throw {
        status: 400,
        message: 'unauthorized',
      };
    }

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw {
        status: 404,
        message: 'prescription not found',
      };
    }

    if (prescription.doctor.toString() !== user._id.toString()) {
      throw {
        status: 400,
        message: 'unauthorized',
      };
    }

    const allowedUpdate = ['diagnose', 'medicines', 'date', 'note'];

    let isValidOperator = updateFields.every((update) =>
      allowedUpdate.includes(update)
    );

    if (!isValidOperator) {
      throw {
        status: 400,
        message: 'you cannot update with one of these fields',
      };
    }

    updateFields.forEach((update) => {
      prescription[update] = updateData[update];
    });

    await prescription.save();
    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const deletePrescription = async (id, user) => {
  try {
    // check user is admin or not
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized',
      };
    }

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw {
        status: 404,
        message: 'prescription not found',
      };
    }

    prescription.isDeleted = true;
    await prescription.save();
    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = {
  createPrescription,
  getPrescriptionByMe,
  updatePrescription,
  deletePrescription,
};
