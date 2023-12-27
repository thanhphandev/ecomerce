import otpGenerator from 'otp-generator';
import OTP from '../models/otp.models';
import EmailModule from '../mailers/transposter';
import 'dotenv/config';
import { IUser } from '../models/users.models';
import { TransportOptions } from 'nodemailer';

const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });

  return otp;
};

interface CustomTransportOptions extends TransportOptions {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

const sendOTP = async (user: IUser) => {
  try {
    const emailConfigs: CustomTransportOptions = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL || '',
        pass: process.env.PASS || '',
      },
    };

    const userExistOTP = await OTP.findOne({ user_id: user._id });

    if (userExistOTP) {
      await OTP.deleteOne({ user_id: user._id });
    }

    const otp = generateOTP();
    const expire_time = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const newOTP = new OTP({ user_id: user._id, otp, expire_in: expire_time });
    await newOTP.save();

    const emailModule = new EmailModule(emailConfigs);
    const sendOTPTemplate = 'send_otp';
    const sendOTPOptions = {
      from: 'AnoTS Developer',
      to: user.email,
      subject: `AnoTS OTP ${user.username}`,
    };
    const returnMailer = {
      username: user.username,
      email: user.email,
      OTP: otp,
    };

    await emailModule.sendEmail(sendOTPTemplate, returnMailer, sendOTPOptions);
    console.log(`Email sent!`);
  } catch (error) {
    console.error(error);
    throw new Error('Server Internal Error');
  }
};

export default sendOTP;
