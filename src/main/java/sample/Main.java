package sample;

import javafx.animation.RotateTransition;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.PerspectiveCamera;
import javafx.scene.Scene;
import javafx.scene.transform.Rotate;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.io.IOException;

public class Main extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {

        Engine engine = new Engine();

        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("/race.fxml"));

        Parent root = loader.load();
        Race controller = loader.getController();
        controller.engine = engine;
        engine.circle = controller.circle;
        primaryStage.setTitle("Race");
        primaryStage.setScene(new Scene(root, Engine.frameLength, Engine.frameLength));
        primaryStage.setX(0.0);
        primaryStage.setY(0.0);
        Stage secStage = new Stage();
        // cleanup controller resources when window closes:
        primaryStage.setOnHidden(e -> {
            controller.shutdown();
            secStage.close();
        });





        FXMLLoader loaderGates = new FXMLLoader();
        loaderGates.setLocation(getClass().getResource("/gates.fxml"));
        Parent rootGates = loaderGates.load();
        secStage.setTitle("Gates");
        Scene scene = new Scene(rootGates, Engine.frameLength, Engine.frameLength);
        secStage.setScene(scene);
        secStage.setY(0.0);
        secStage.setX(Engine.frameLength);


        PerspectiveCamera camera = new PerspectiveCamera(true);

        scene.setCamera(camera);
        camera.setFieldOfView(90.0);
        camera.setFarClip(1200.0);
        camera.setNearClip(10.0);

        Gates controllerGates = loaderGates.getController();
        controllerGates.camera = camera;
        engine.camera = camera;

        RaceView rw = new RaceView();

        rw.circle = controller.circle;
        rw.gates = controller.gates;
        rw.gateNums = controller.gateNums;
        engine.rw = rw;

        secStage.show();

        camera.setRotationAxis(Rotate.Y_AXIS);

       /* RotateTransition rt = new RotateTransition(new Duration(6000), camera);

        rt.setCycleCount(10);
        rt.setAutoReverse(true);

        rt.setByAngle(360);
        rt.play(); */

        primaryStage.show();
        rw.translateViews();
        engine.run();
        root.requestFocus();
    }
}
