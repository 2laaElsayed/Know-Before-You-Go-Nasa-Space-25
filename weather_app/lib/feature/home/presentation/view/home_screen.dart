
import 'package:flutter/material.dart';
import 'package:knowBeforeYouGo/feature/home/presentation/widgets/show_modal_bottom_sheet_widget.dart' show TaskContainerWidget;
import 'package:knowBeforeYouGo/feature/map/view/map_screen.dart';
import 'package:knowBeforeYouGo/feature/menu/view/menu_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  static const String routeName = 'HomeScreen';

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool showContainer = false;

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
          child: Stack(
            children: [
              SingleChildScrollView(
                child: Column(
                  children: [
                    Image.asset(
                      'assets/images/get_started_screen.png',
                      width: 244,
                    ),
                    const Text(
                      '19°',
                      style: TextStyle(fontSize: 64, color: Colors.white),
                    ),
                    const Text(
                      'Precipitations',
                      style: TextStyle(fontSize: 24, color: Colors.white),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Text(
                          'Max: 24°',
                          style: TextStyle(fontSize: 24, color: Colors.white),
                        ),
                        SizedBox(width: 20),
                        Text(
                          'Min: 18°',
                          style: TextStyle(fontSize: 24, color: Colors.white),
                        ),
                      ],
                    ),
                    Image.asset('assets/images/house_1_image.png'),
                  ],
                ),
              ),

             
              if (showContainer)
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 0,
                  child: const TaskContainerWidget(),
                ),
            ],
          ),
        ),
        bottomNavigationBar: Padding(
          padding: const EdgeInsets.all(25),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(
                  Icons.map_outlined,
                  size: 38,
                  color: Colors.white,
                ),
                onPressed: () {
                  Navigator.of(context).pushNamed(MapScreen.routeName);
                },
              ),
              const Spacer(),
              IconButton(
                icon: Icon(
                  showContainer
                      ? Icons.remove_circle_outline_sharp
                      : Icons.add_circle_outline_sharp,
                  size: 38,
                  color: Colors.white,
                ),
                onPressed: () {
                  setState(() {
                    showContainer = !showContainer;
                  });
                },
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.menu, size: 38, color: Colors.white),
                onPressed: () {
                  Navigator.of(context).pushNamed(MenuScreen.routeName);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
