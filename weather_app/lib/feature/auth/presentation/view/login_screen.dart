
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:knowBeforeYouGo/core/common/widget/material_button_widget_helper.dart';
import 'package:knowBeforeYouGo/core/dialogs/app_dialogs.dart';
import 'package:knowBeforeYouGo/core/dialogs/app_toasts.dart';
import 'package:knowBeforeYouGo/core/utils/app_colors.dart';
import 'package:knowBeforeYouGo/feature/auth/presentation/view/register_screen.dart';
import 'package:knowBeforeYouGo/feature/auth/presentation/view_model/login/login_cubit.dart';
import 'package:knowBeforeYouGo/feature/home/presentation/view/home_screen.dart';
import 'package:toastification/toastification.dart';
import '../../../../core/common/widget/custom_form_text_fiel.dart';
import '../../../../core/utils/validator_functions.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  static const String routeName = "LoginScreen";
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late GlobalKey<FormState> formKey;
  late String email;
  late String password;
  late LoginCubit cubit;
  @override
  void initState() {
    super.initState();
    email = '';
    password = '';
    formKey = GlobalKey<FormState>();
    cubit = LoginCubit();
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
          backgroundColor: Colors.transparent,
          title: Text(
            "Login",
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
          child: Form(
            key: formKey,
            child: BlocListener<LoginCubit, LoginState>(
              bloc: cubit,
              listener: (context, state) {
                if (state is LoginLoading) {
                  AppDialogs.showLoadingDialog(context);
                }
                if (state is LoginSuccess) {
                  Navigator.of(context).pop();
                  AppToast.showToast(
                    context: context,
                    title: ' Success',
                    description: " Login Successfully",
                    type: ToastificationType.success,
                  );
                  Navigator.pushReplacementNamed(context, HomeScreen.routeName);
                }
                if (state is LoginError) {
                  Navigator.of(context).pop();
                  AppToast.showToast(
                    context: context,
                    title: 'Error',
                    description: state.message,
                    type: ToastificationType.error,
                  );
                }
              },
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
                      keyboardType: TextInputType.emailAddress,
                      action: TextInputAction.next,
                    ),
                    SizedBox(height: 30),
                    MaterialButtonWidget(
                      onPressed: () async {
                        if (formKey.currentState!.validate()) {
                          await cubit.login(email, password);
                        }
                      },
                      color: AppColors.buttonColor,
                      title: 'Login',

                      titleColor: AppColors.buttonTitleColor,
                      height: 65,
                    ),
                  ],
                ),
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
                    Navigator.of(context).pushNamed(RegisterScreen.routeName);
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text.rich(
                        TextSpan(
                          text: "Don't have an account? ",
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.primaryTextColor,
                          ),
                          children: [
                            TextSpan(
                              text: "Sign Up",
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
