
import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/feature/home/presentation/get_started/get_start_screen.dart';
import 'package:knowBeforeYouGo/feature/home/presentation/view/home_screen.dart';
import 'package:knowBeforeYouGo/feature/home/presentation/view/splash_screen.dart';
import 'package:knowBeforeYouGo/feature/map/view/map_screen.dart';
import 'package:knowBeforeYouGo/feature/menu/view/menu_screen.dart';

import 'feature/auth/presentation/view/login_screen.dart';
import 'feature/auth/presentation/view/register_screen.dart';
import 'feature/onboarding/onboarding_screen.dart';

import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const WeatherApp());
}

class WeatherApp extends StatelessWidget {
  const WeatherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "User App",
      initialRoute: SplashScreen.routeName,
      routes: {
        SplashScreen.routeName: (context) => SplashScreen(),
        GetStartedScreen.routeName: (context) => GetStartedScreen(),
        OnboardingScreen.routeName: (context) => const OnboardingScreen(),
        LoginScreen.routeName: (context) => const LoginScreen(),
        RegisterScreen.routeName: (context) => const RegisterScreen(),
        HomeScreen.routeName: (context) => HomeScreen(),
        MapScreen.routeName: (context) => MapScreen(),
        MenuScreen.routeName: (context) => MenuScreen(),
      },
    
    );
  }
}
