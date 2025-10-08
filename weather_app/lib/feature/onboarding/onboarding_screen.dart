
import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/core/common/widget/material_button_widget_helper.dart';
import 'package:knowBeforeYouGo/core/utils/app_colors.dart';
import 'package:knowBeforeYouGo/feature/auth/presentation/view/login_screen.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  static const routeName = 'OnboardingScreen';
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  List<OnboardingData> onboardingList = dataOnbarding();
  int index = 0;
  PageController controller = PageController();
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
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                height: 260,
                child: PageView.builder(
                  controller: controller,
                  onPageChanged: (value) {
                    setState(() {
                      index = value;
                    });
                  },
                  itemBuilder: (context, index) {
                    return CustomAnimatedWidget(
                      delay: index,
                      index: index,
                      child: Image.asset(onboardingList[index].image),
                    );
                  },
                  itemCount: onboardingList.length,
                ),
              ),
              SizedBox(height: 50),
              SmoothPageIndicator(
                controller: controller,
                count: onboardingList.length,
                effect: ExpandingDotsEffect(
                  activeDotColor: AppColors.secoundryTextColor,
                  dotColor: AppColors.primaryTextColor,
                  spacing: 10,
                  radius: 10,
                  dotWidth: 10,
                  dotHeight: 10,
                ),
              ),
              SizedBox(height: 50),
              CustomAnimatedWidget(
                delay: (index + 1) * 200,
                index: index,
                child: Container(
                  margin: EdgeInsets.symmetric(horizontal: 38),
                  width: double.infinity,
                  child: Column(
                    children: [
                      Text(
                        onboardingList[index].title,
                        style: TextStyle(
                          color: AppColors.buttonColor,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 42),
                      Text(
                        onboardingList[index].description,
                        style: TextStyle(
                          color: AppColors.primaryTextColor,
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 102),
              Padding(
                padding: const EdgeInsets.all(30),
                child: Align(
                  alignment: Alignment.bottomRight,
                  child: MaterialButtonWidget(
                    onPressed: () {
                      if (index < onboardingList.length - 1) {
                        controller.nextPage(
                          duration: Duration(milliseconds: 500),
                          curve: Curves.easeIn,
                        );
                      } else {
                        Navigator.of(
                          context,
                        ).pushReplacementNamed(LoginScreen.routeName);
                      }
                    },
                    color: AppColors.buttonColor,
                    title: index < onboardingList.length - 1
                        ? "Next"
                        : "Get Started",

                    titleColor: AppColors.buttonTitleColor,
                    height: 65,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class OnboardingData {
  final String image;
  final String title;
  final String description;

  OnboardingData({
    required this.image,
    required this.title,
    required this.description,
  });
}

List<OnboardingData> dataOnbarding() {
  return [
    OnboardingData(
      image: 'assets/images/onboarding-1-screen.png',
      title: 'Real-Time Weather',
      description: 'Get accurate updates instantly for your location.',
    ),
    OnboardingData(
      image: 'assets/images/onboarding-2-screen.png',
      title: 'Weekly Forecasts',
      description: 'Plan your day and week with reliable predictions.',
    ),
    OnboardingData(
      image: 'assets/images/onboarding-3-screen.png',
      title: 'Smart Alerts',
      description: 'Receive notifications for sudden weather changes.',
    ),
  ];
}

class CustomAnimatedWidget extends StatelessWidget {
  const CustomAnimatedWidget({
    Key? key,
    required this.index,
    required this.delay,
    required this.child,
  }) : super(key: key);
  final int index;
  final int delay;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (index == 1) {
      return FadeInDown(
        delay: Duration(milliseconds: delay),
        child: child,
      );
    }
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: child,
    );
  }
}
