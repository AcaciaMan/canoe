package sample;

import javafx.animation.TranslateTransition;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Group;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Cylinder;
import javafx.util.Duration;

import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Race implements Initializable {

    @FXML public Circle circle;
    @FXML public Circle[] gates = new Circle[Engine.gates.length];
    @FXML private Group group;

    Engine engine;

    ScheduledExecutorService executor;

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        circle = new Circle();

        circle.setLayoutX( //300
                (double)Engine.frameLength/2
                );
        circle.setLayoutY( //300
                Engine.frameLength //-(Engine.circleRadius*2)
                );
        circle.setRadius(Engine.circleRadius);

        circle.setFill(Color.BLUE);

        group.getChildren().add(circle);


        for (int i = 0; i < Engine.gates.length; i++) {
            gates[i] = new Circle();
            gates[i].setRadius(2);
            if(Engine.gates[i][2]==0) {
                gates[i].setFill(Color.GREEN);
            } else {
                gates[i].setFill(Color.RED);
            }
            gates[i].setLayoutX(((double)Engine.frameLength/2) + Engine.gates[i][0]);
            gates[i].setLayoutY(Engine.frameLength-Engine.gates[i][1]);
        }
        //Setting the properties of the Cylinder


        group.getChildren().addAll(gates);

        //engine.circle = circle;
        //engine.boatX = (double)Engine.frameLength/2;
        //engine.boatY = Engine.frameLength-(Engine.circleRadius*2);

        //executor = Executors.newSingleThreadScheduledExecutor();

        //executor.scheduleAtFixedRate(engine, 150, 150, TimeUnit.MILLISECONDS);
        //engine.run();
    }


    @FXML
    public void onKeyPressed(KeyEvent keyEvent) {

        //Playing the animation
        //translateTransition.play();

        if(keyEvent.getCode() == KeyCode.UP) {
            engine.pressedUP();
        } else if (keyEvent.getCode() == KeyCode.DOWN) {
            engine.pressedDOWN();
        } else if (keyEvent.getCode() == KeyCode.LEFT) {
            engine.pressedLEFT();
        } else if (keyEvent.getCode() == KeyCode.RIGHT) {
            engine.pressedRIGHT();
        }


        //engine.drawCircle(circle);

    }

    @FXML
    public void onKeyReleased(KeyEvent keyEvent) {


        //Playing the animation
        //translateTransition.stop();

        //circle.setTranslateY(-10);

        if(keyEvent.getCode() == KeyCode.UP) {
            engine.releasedUP();
        } else if (keyEvent.getCode() == KeyCode.DOWN) {
            engine.releasedDOWN();
        } else if (keyEvent.getCode() == KeyCode.LEFT) {
            engine.releasedLEFT();
        } else if (keyEvent.getCode() == KeyCode.RIGHT) {
            engine.releasedRIGHT();
        }

    }

    public void shutdown() {
        //executor.shutdown();
        engine.isStop=true;
    }

}
