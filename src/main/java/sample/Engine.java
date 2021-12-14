package sample;

import javafx.animation.*;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Camera;
import javafx.scene.shape.Circle;

import java.time.Duration;
import java.time.Instant;

public class Engine implements Runnable{

    public static Integer raceLength = 300;
    public static Integer raceDuration = 80 * 1000;
    public static Double boatWidth = 0.6;
    public static Integer frameLength = 600;
    public static Integer frameLength3d = 1000;
    public static Double frameTimes = 2.0;
    public static Integer frameGates = 5;
    public static Integer raceGates = 25;

    public static Double pixelMeter = ((double)frameLength / (raceLength / (raceGates/frameGates)));

    public static Double circleRadius = boatWidth * pixelMeter;

    public static Double frameDuration = ((double)frameLength / (raceDuration / (raceGates/frameGates)));

    public static Double pixelDuration = frameDuration * frameTimes;

    public static int[][] gates = {{15,200,0, -5}, {45,200,0, -5}, {-15,300,0,-5}, {-45,300,0,-5},
            {45,400,1, 15}, {75,400,1, 15}, {-45,400,1, 15}, {-75,400,1, 15},
            {-100,500,0,15}, {-130,500,0,15}, {-45,600,0,15}, {-75,600,0,15},
            {-100,700,0,15}, {-130,700,0,15}, {-15,800,1,15}, {15,800,1,15},
            {100,900,0,15}, {130,900,0,15}, {45,1000,0,15}, {75,1000,0,15},
            {100,1100,0,15}, {130,1100,0,15}, {-15,1200,0,15}, {15,1200,0,15}
    };

    public static double[][] falls = {{350.0,20.0}, {1250.0,60.0}};

    public Speed speed = new Speed();
    public Direction direct = new Direction();
    public boolean isStop = false;


    //if UP keyPressed 500 milliseconds, then speed = speed + 1;

    Instant start = Instant.now();
    // CODE HERE
    Instant finish = Instant.now();
    long timeElapsed = Duration.between(start, finish).toMillis();

    public Double boatY = 0.0;
    public Double boatX = 0.0;
    public Double prevBoatY = 0.0;

    public Circle circle;
    public Camera camera;
    public Move move = new Move();
    public RaceView rw;



    public void drawCircle(Circle circle) {
        finish = Instant.now();

        if (Duration.between(start, finish).toMillis()>500) {

            circle.setTranslateY(boatY);
            start = Instant.now();
        }
    }

    @Override
    public void run() {

        move.vector = speed.getVector();
        move.angle = direct.getAngle();


        prevBoatY = boatY;

        boatY = boatY - move.getMoveY();
        //circle.setTranslateY(boatY);

        boatX = boatX - move.getMoveX();
        //circle.setTranslateX(boatX);

        //circle.relocate(boatX,boatY);


        //Timeline timeline = new Timeline();
        //KeyValue keyValueX = new KeyValue(circle.translateXProperty(),boatX);
        //KeyValue keyValueY = new KeyValue(circle.translateYProperty(),boatY);
        //KeyFrame keyFrame = new KeyFrame(javafx.util.Duration.millis(100.0), keyValueX, keyValueY);
        //timeline.getKeyFrames().add(keyFrame);
        //timeline.play();

        TranslateTransition translateTransition =
                new TranslateTransition(new javafx.util.Duration(50.0), circle);
        translateTransition.setByX(-move.getMoveX());
        translateTransition.setByY(-move.getMoveY());

        TranslateTransition translateTransitionC =
                new TranslateTransition(new javafx.util.Duration(45.0), camera);
        translateTransitionC.setByX(-move.getMoveX());
        translateTransitionC.setByZ(move.getMoveY());

        RotateTransition rt = new RotateTransition(new javafx.util.Duration(45.0), camera);
        rt.setByAngle(-direct.angleChange);

        if (!isStop) {
            ParallelTransition parallelTransition = new ParallelTransition(
                    translateTransitionC,
                    rt,
                    translateTransition);

            // if boat fall then translate transition y down by i[][1]
            //  350  < --351   && 350 >= 350
            for (int i = 0; i < Engine.falls.length; i++) {
                if (Double.compare(Engine.falls[i][0], -boatY) >= 0 && Double.compare(Engine.falls[i][0], -prevBoatY) < 0) {
                    TranslateTransition translateTransitionYup =
                            new TranslateTransition(new javafx.util.Duration(45.0), camera);
                    translateTransitionYup.setByY(-Engine.falls[i][1]);
                    parallelTransition.getChildren().add(translateTransitionYup);
                }// if boat fall then translate transition y down by i[][1]
                if (Double.compare(Engine.falls[i][0], -boatY) <= 0 && Double.compare(Engine.falls[i][0], -prevBoatY) > 0) {
                    TranslateTransition translateTransitionY =
                            new TranslateTransition(new javafx.util.Duration(45.0), camera);
                    translateTransitionY.setByY(Engine.falls[i][1]);
                    parallelTransition.getChildren().add(translateTransitionY);
                }
            }

           rw.translateViewsStage(parallelTransition, boatY, prevBoatY);


            parallelTransition.setOnFinished(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    run();
                }
            });

            parallelTransition.play();
        }



    }


    public void pressedUP() {
        //System.out.println("UP");
        speed.pressedUP();
    }


    public void releasedUP() {
        speed.releasedUP();
    }


    public void pressedDOWN() {
        speed.pressedDOWN();
    }

    public void releasedDOWN() {
        speed.releasedDOWN();
    }

    public void pressedLEFT() {
        direct.pressedLEFT();
    }

    public void pressedRIGHT() {
        direct.pressedRIGHT();
    }

    public void releasedLEFT() {
        direct.releasedLEFT();
    }

    public void releasedRIGHT() {
        direct.releasedRIGHT();
    }

}
