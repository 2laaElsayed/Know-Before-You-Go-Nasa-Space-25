import 'package:flutter/material.dart';

class MaterialButtonWidget extends StatelessWidget {
  const MaterialButtonWidget({
    super.key,
    this.onPressed,
    this.color,
    this.titleColor,
    this.title,
    this.height = 56,
    this.width = 900,
  });
  final void Function()? onPressed;
  final Color? color;
  final Color? titleColor;
  final String? title;
  final double? height;
  final double? width;
  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      color: color,
      minWidth: width,
      height: height,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
      onPressed: onPressed,
      child: Text(
        title ?? 'Next',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: titleColor,
        ),
      ),
    );
  }
}
