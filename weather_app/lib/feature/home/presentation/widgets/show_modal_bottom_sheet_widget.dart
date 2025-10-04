import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class TaskContainerWidget extends StatefulWidget {
  const TaskContainerWidget({super.key});

  @override
  State<TaskContainerWidget> createState() => _TaskContainerWidgetState();
}

class _TaskContainerWidgetState extends State<TaskContainerWidget> {
  List hourlyWeather = [];
  String city = "";

  @override
  void initState() {
    super.initState();
    _loadCityAndWeather();
  }

  Future<void> _loadCityAndWeather() async {
    final prefs = await SharedPreferences.getInstance();
    city = prefs.getString('selectedCity') ?? "Cairo"; 
    await _fetchWeather();
  }

  Future<void> _fetchWeather() async {
    final url =
        "https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&hourly=temperature_2m&forecast_days=1";

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List times = data['hourly']['time'];
        final List temps = data['hourly']['temperature_2m'];

      
        setState(() {
          hourlyWeather = List.generate(
            4,
            (i) => {
              "time": times[i].substring(11, 16),
              "temp": temps[i].toString(),
            },
          );
        });
      } else {
        setState(() {
          hourlyWeather = [];
        });
      }
    } catch (e) {
      setState(() {
        hourlyWeather = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.25),
            spreadRadius: 0,
            blurRadius: 4,
            offset: Offset(0, 3),
          ),
        ],
        borderRadius: BorderRadius.circular(30),
        gradient: const LinearGradient(
          colors: [
            Color.fromARGB(255, 28, 34, 66),
            Color.fromARGB(255, 67, 59, 142),
            Color.fromARGB(255, 150, 62, 170),
          ],
          begin: Alignment.topRight,
          end: Alignment.topLeft,
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            city,
            style: const TextStyle(
              fontSize: 22,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Divider(color: Colors.white, thickness: 2),
          const SizedBox(height: 10),
          if (hourlyWeather.isEmpty)
            const Center(
              child: Text("No data", style: TextStyle(color: Colors.white)),
            )
          else
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: hourlyWeather.map((hour) {
                return Column(
                  children: [
                    Text(
                      "${hour['temp']}°C",
                      style: const TextStyle(fontSize: 18, color: Colors.white),
                    ),
                    const Icon(Icons.wb_sunny, color: Colors.yellow, size: 40),
                    Text(
                      hour['time'],
                      style: const TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ],
                );
              }).toList(),
            ),
        ],
      ),
    );
  }
}
