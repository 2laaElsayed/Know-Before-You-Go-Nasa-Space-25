
import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/core/common/widget/material_button_widget_helper.dart';
import 'package:knowBeforeYouGo/core/utils/app_colors.dart';
import 'package:knowBeforeYouGo/feature/onboarding/onboarding_screen.dart';

class GetStartedScreen extends StatelessWidget {
  GetStartedScreen({super.key});
  static const routeName = 'GetStartedScreen';

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
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(30),
            child: Column(
              children: [
                Image.asset('assets/images/get_started_screen.png'),
                Spacer(),
                Text(
                  'Weather',
                  style: TextStyle(
                    fontSize: 50,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Spacer(),
                MaterialButtonWidget(
                  onPressed: () {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(
                        builder: (context) => OnboardingScreen(),
                      ),
                    );
                  },
                  color: AppColors.buttonColor,
                  title: 'GET STARTED',

                  titleColor: AppColors.buttonTitleColor,
                  height: 65,
                ),
                Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
