import 'dart:convert';
import 'package:http/http.dart' as http;

class WeatherApi {
  static Future<List<Map<String, dynamic>>> getWeather(
    double lat,
    double lon,
  ) async {
    final url =
        "https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto";

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);

      final dates = body["daily"]["time"] as List;
      final tempMax = body["daily"]["temperature_2m_max"] as List;
      final tempMin = body["daily"]["temperature_2m_min"] as List;
      final weatherCodes = body["daily"]["weathercode"] as List;

      return List.generate(dates.length, (index) {
        return {
          "date": dates[index],
          "temp_max": tempMax[index],
          "temp_min": tempMin[index],
          "weathercode": weatherCodes[index],
        };
      });
    } else {
      throw Exception("Error fetching weather data:${response.statusCode}");
    }
  }
}
