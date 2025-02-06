import { z } from "zod";
import libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Mobile number is required" })
  .refine(
    (number) => {
      try {
        const phoneNumber = phoneUtil.parse(number);
        return phoneUtil.isValidNumber(phoneNumber);
      } catch (error) {
        return false;
      }
    },
    { message: "Invalid mobile number" }
  );

export const phoneNumberValidator = z.object({
  mobile: phoneNumberSchema,
});