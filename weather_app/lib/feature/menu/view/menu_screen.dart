import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/feature/home/data/api/weather_api.dart';
import 'package:shared_preferences/shared_preferences.dart';


class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});
  static const String routeName = "MenuScreen";

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  List<Map<String, dynamic>> forecast = [];
  bool isLoading = true;
  String? currentCity;

  @override
  void initState() {
    super.initState();
    _loadSavedLocation();
  }


  Future<void> _loadSavedLocation() async {
    final prefs = await SharedPreferences.getInstance();
    final lat = prefs.getDouble("lat");
    final lon = prefs.getDouble("lon");
    final city = prefs.getString("city");

    if (lat != null && lon != null && city != null) {
      setState(() => currentCity = city);
      await _fetchWeather(lat, lon, city);
    } else {
      setState(() => isLoading = false);
    }
  }


  Future<void> _saveLocation(double lat, double lon, String city) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble("lat", lat);
    await prefs.setDouble("lon", lon);
    await prefs.setString("city", city);
  }


  Future<void> _fetchWeather(double lat, double lon, [String? city]) async {
    try {
      final data = await WeatherApi.getWeather(lat, lon);
      setState(() {
        forecast = data;
        isLoading = false;
        if (city != null) currentCity = city;
      });
      if (city != null) {
        await _saveLocation(lat, lon, city);
      }
    } catch (e) {
      print(" Error while fetching weather data: $e");
      setState(() => isLoading = false);
    }
  }

  IconData _mapWeatherCodeToIcon(int code) {
    if ([0].contains(code)) return Icons.wb_sunny; 
    if ([1, 2, 3].contains(code)) return Icons.wb_cloudy; 
    if ([45, 48].contains(code)) return Icons.foggy; 
    if ([51, 53, 55, 61, 63, 65].contains(code)) return Icons.grain;
    if ([71, 73, 75].contains(code)) return Icons.ac_unit; 
    if ([95, 96, 99].contains(code)) return Icons.flash_on; 
    return Icons.cloud; 
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    if (args != null) {
      final lat = args["lat"];
      final lon = args["lon"];
      final city = args["city"] ?? "Egypt";
      _fetchWeather(lat, lon, city);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color.fromARGB(255, 28, 34, 66),
            Color.fromARGB(255, 67, 59, 142),
            Color.fromARGB(255, 150, 62, 170),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: SafeArea(
          child: isLoading
              ? const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                )
              : forecast.isEmpty
              ? const Center(
                  child: Text(
                    "No saved location.\nPlease select a city.",
                    style: TextStyle(color: Colors.white, fontSize: 18),
                    textAlign: TextAlign.center,
                  ),
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 20),
                    Center(
                      child: Text(
                        currentCity ?? "Weather Forecast",
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Expanded(
                      child: ListView.builder(
                        itemCount: forecast.length,
                        itemBuilder: (context, index) {
                          final day = forecast[index];
                          return Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              gradient: const LinearGradient(
                                colors: [
                                  Color.fromARGB(255, 28, 34, 66),
                                  Color.fromARGB(255, 67, 59, 142),
                                  Color.fromARGB(255, 150, 62, 170),
                                ],
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "${day["date"]}",
                                      style: const TextStyle(
                                        color: Colors.white70,
                                        fontSize: 14,
                                      ),
                                    ),
                                    const SizedBox(height: 5),
                                    Text(
                                      "Max: ${day["temp_max"]}°C",
                                      style: const TextStyle(
                                        fontSize: 18,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      "Min: ${day["temp_min"]}°C",
                                      style: const TextStyle(
                                        fontSize: 16,
                                        color: Colors.white70,
                                      ),
                                    ),
                                  ],
                                ),
                                Icon(
                                  _mapWeatherCodeToIcon(day["weathercode"]),
                                  color: Colors.white,
                                  size: 50,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      icon: Icon(Icons.menu, size: 38, color: Colors.white),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
