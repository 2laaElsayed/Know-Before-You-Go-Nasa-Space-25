import 'dart:async';
import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/feature/onboarding/onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  static const routeName = 'SplashScreen';

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.delayed(
      const Duration(seconds: 4),
      () => Navigator.pushReplacementNamed(context, OnboardingScreen.routeName),
    );
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
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ShakeY(
                  duration: const Duration(seconds: 2),
                  infinite: true,
                  child: Image.asset(
                    'assets/images/onboarding-1-screen.png',
                    width: 120, 
                    height: 120,
                  ),
                ),

                const SizedBox(height: 30),

       
                FadeInUp(
                  duration: const Duration(milliseconds: 1600),
                  child: const Text(
                    "Know Before You Go",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
