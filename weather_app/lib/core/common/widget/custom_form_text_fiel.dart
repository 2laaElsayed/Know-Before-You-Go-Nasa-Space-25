import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/core/utils/app_colors.dart';

class TextFormFieldHelper extends StatefulWidget {
  const TextFormFieldHelper({
    super.key,
    this.isPassword = false,
    this.hintText,
    this.validator,
    this.onChanged,
    this.onEditingComplete,
    this.onTap,
    this.keyboardType,
    this.suffixWidget,
    this.prefixIcon,
    this.prefix,
    this.action,
    this.focusNode,
    this.borderRadius,
  });
  final bool isPassword;
  final String? hintText;
  final String? Function(String?)? validator;
  final void Function(String?)? onChanged;
  final void Function()? onEditingComplete, onTap;
  final TextInputType? keyboardType;
  final Widget? suffixWidget, prefixIcon, prefix;
  final TextInputAction? action;
  final FocusNode? focusNode;
  final BorderRadius? borderRadius;

  @override
  State<TextFormFieldHelper> createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<TextFormFieldHelper> {
  late bool obscureText;

  @override
  void initState() {
    super.initState();
    obscureText = widget.isPassword;
  }

  void _toggleObscureText() {
    setState(() => obscureText = !obscureText);
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      validator: widget.validator,
      onChanged: (text) {
        widget.onChanged?.call(text);
      },
      onEditingComplete: widget.onEditingComplete,
      onTap: widget.onTap,
      obscureText: obscureText,

      keyboardType: widget.keyboardType,
      // inputFormatters: widget.inputFormatters,
      textInputAction: widget.action ?? TextInputAction.next,
      focusNode: widget.focusNode,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      style: TextStyle(
        fontSize: 16,
        color: AppColors.primeTextColor,
        fontWeight: FontWeight.w500,
      ),

      textAlignVertical: TextAlignVertical.center,
      decoration: InputDecoration(
        fillColor: Colors.transparent,
        filled: true,
        hintText: widget.hintText,
        hintStyle: TextStyle(
          fontSize: 16,
          color: const Color.fromARGB(138, 255, 255, 255),
          fontWeight: FontWeight.w500,
        ),
        errorMaxLines: 4,
        errorStyle: const TextStyle(color: Colors.red),
        prefixIcon: widget.prefixIcon,
        prefix: widget.prefix,
        suffixIcon: widget.isPassword
            ? GestureDetector(
                onTap: _toggleObscureText,
                child: Icon(
                  obscureText ? Icons.visibility_off : Icons.visibility,
                  color: AppColors.primeTextColor,
                  size: 27,
                ),
              )
            : widget.suffixWidget,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 13,
          vertical: 22,
        ),
        border: outlineInputBorder(color: Colors.grey, width: 1),
        enabledBorder: outlineInputBorder(
          color: AppColors.primaryTextColor,
          width: 1.5,
        ),
        focusedBorder: outlineInputBorder(
          color: AppColors.secoundryTextColor,
          width: 1,
        ),
        errorBorder: outlineInputBorder(color: Colors.red, width: 1),
        focusedErrorBorder: outlineInputBorder(color: Colors.red, width: 1),
      ),
    );
  }

  OutlineInputBorder outlineInputBorder({
    required Color color,
    required double width,
  }) {
    return OutlineInputBorder(
      borderRadius: widget.borderRadius ?? BorderRadius.circular(50),
      borderSide: BorderSide(color: color, width: width),
    );
  }
}
