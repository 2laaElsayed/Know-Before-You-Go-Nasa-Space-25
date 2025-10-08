
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:knowBeforeYouGo/core/common/widget/material_button_widget_helper.dart';
import 'package:knowBeforeYouGo/core/dialogs/app_dialogs.dart';
import 'package:knowBeforeYouGo/core/utils/app_colors.dart';
import 'package:knowBeforeYouGo/feature/auth/presentation/view_model/register/register_cubit.dart';
import 'package:toastification/toastification.dart';
import '../../../../core/common/widget/custom_form_text_fiel.dart';
import '../../../../core/dialogs/app_toasts.dart';
import '../../../../core/utils/validator_functions.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  static const String routeName = "RegisterScreen";

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late GlobalKey<FormState> formKey;
  late String name;
  late String email;
  late String password;
  late String confirmPassword;

  late RegisterCubit registerCubit;

  @override
  void initState() {
    super.initState();
    formKey = GlobalKey<FormState>();
    name = '';
    email = '';
    password = '';
    confirmPassword = '';

    registerCubit = RegisterCubit(); 
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color.fromARGB(255, 28, 34, 66),
            const Color.fromARGB(255, 67, 59, 142),
            const Color.fromARGB(255, 150, 62, 170),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          iconTheme: IconThemeData(color: AppColors.primeTextColor),
          backgroundColor: Colors.transparent,
          title: Text(
            "SignUp",
            style: TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.bold,
              color: AppColors.primeTextColor,
            ),
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: BlocListener<RegisterCubit, RegisterState>(
            bloc: registerCubit,
            listener: (context, state) {
              if (state is RegisterLoading) {
                AppDialogs.showLoadingDialog(context);
              }
              if (state is RegisterError) {
                Navigator.of(context).pop();
                AppToast.showToast(
                  context: context,
                  title: "Error",
                  description:
                      state.message, 
                  type: ToastificationType.error,
                );
              }
              if (state is RegisterSuccess) {
                Navigator.of(context).pop();
                AppToast.showToast(
                  context: context,
                  title: "Success",
                  description: "Account created successfully!",
                  type: ToastificationType.success,
                );
              }
            },
            child: Form(
              key: formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 30),
                  Text(
                    "Name",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AppColors.primeTextColor,
                    ),
                  ),
                  SizedBox(height: 5),
                  TextFormFieldHelper(
                    onChanged: (v) => name = v ?? '',
                    validator: Validator.validateName,
                    hintText: "Enter your Name",
                    keyboardType: TextInputType.name,
                    action: TextInputAction.next,
                  ),
                  SizedBox(height: 30),
                  Text(
                    "Email",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AppColors.primeTextColor,
                    ),
                  ),
                  SizedBox(height: 5),
                  TextFormFieldHelper(
                    onChanged: (v) => email = v ?? '',
                    validator: Validator.validateEmail,
                    hintText: "Enter your email",
                    keyboardType: TextInputType.emailAddress,
                    action: TextInputAction.next,
                  ),
                  SizedBox(height: 30),
                  Text(
                    "Password",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AppColors.primeTextColor,
                    ),
                  ),
                  SizedBox(height: 5),
                  TextFormFieldHelper(
                    onChanged: (v) => password = v ?? '',
                    validator: Validator.validatePassword,
                    hintText: "Enter your password",
                    isPassword: true,
                    keyboardType: TextInputType.visiblePassword,
                    action: TextInputAction.next,
                  ),
                  SizedBox(height: 30),
                  Text(
                    "Confirm Password",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AppColors.primeTextColor,
                    ),
                  ),
                  SizedBox(height: 5),
                  TextFormFieldHelper(
                    onChanged: (v) => confirmPassword = v ?? '',
                    validator: (value) =>
                        Validator.validateConfirmPassword(value, password),
                    hintText: "Enter your confirm password",
                    isPassword: true,
                    keyboardType: TextInputType.visiblePassword,
                    action: TextInputAction.done,
                  ),
                  SizedBox(height: 30),
                  MaterialButtonWidget(
                    onPressed: () async {
                      if (formKey.currentState!.validate()) {
                        await registerCubit.register(
                          email,
                          password,
                        ); 
                      }
                    },
                    color: AppColors.buttonColor,
                    title: 'Sign up',
                    titleColor: AppColors.buttonTitleColor,
                    height: 65,
                  ),
                ],
              ),
            ),
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        floatingActionButtonAnimator: FloatingActionButtonAnimator.noAnimation,
        floatingActionButton: MediaQuery.of(context).viewInsets.bottom == 0
            ? Align(
                alignment: Alignment.bottomCenter,
                child: GestureDetector(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text.rich(
                        TextSpan(
                          text: "Already have an account? ",
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.primeTextColor,
                          ),
                          children: [
                            TextSpan(
                              text: "Login",
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.secoundryTextColor,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )
            : null,
      ),
    );
  }
}
