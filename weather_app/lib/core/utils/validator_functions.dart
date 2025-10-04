
import 'package:knowBeforeYouGo/core/constants/app_keys.dart';

abstract class Validator {
  static String? validateEmail(String? val) {
    final RegExp emailRegex = RegExp(AppKeys.emailRegex);
    if (val == null || val.trim().isEmpty) {
      return 'Email cannot be empty';
    } else if (!emailRegex.hasMatch(val)) {
      return 'Enter a valid email address';
    } else {
      return null;
    }
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password cannot be empty';
    } else if (value.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain at least one uppercase letter';
    } else if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Password must contain at least one lowercase letter';
    } else if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Password must contain at least one number';
    } else if (!RegExp(r'[!@#\$%^&*(),.?":{}|<>]').hasMatch(value)) {
      return 'Password must contain at least one special character';
    }
    return null;
  }

  static String? validateConfirmPassword(String? val, String? password) {
    if (val == null || val.isEmpty) {
      return 'Password cannot be empty';
    } else if (val != password) {
      return 'Confirm password must match the password';
    } else {
      return null;
    }
  }

  static String? validateName(String? val) {
    if (val == null || val.isEmpty) {
      return 'Name cannot be empty';
    } else {
      return null;
    }
  }

  static String? validatePhoneNumber(String? val) {
    if (val == null || val.trim().isEmpty) {
      return 'Phone number cannot be empty';
    }

    final phone = val.trim();
    final isValid = RegExp(r'^\+?\d+$').hasMatch(phone);
    if (!isValid || phone.length != 13) {
      return 'Enter a valid phone number';
    }

    return null;
  }

  static String? validateCode(String? val) {
    if (val == null || val.isEmpty) {
      return 'Code cannot be empty';
    } else if (val.length < 6) {
      return 'Code should be at least 6 digits';
    } else {
      return null;
    }
  }
}
