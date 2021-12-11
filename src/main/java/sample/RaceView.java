package sample;

import javafx.animation.ParallelTransition;
import javafx.animation.TranslateTransition;
import javafx.scene.shape.Circle;

public class RaceView {

    public static int[][] views = {{Engine.frameLength/2,100},{Engine.frameLength/2,300}};

    public Circle circle;

    public Circle[] gates;

    public boolean once = false;

    public void translateViews() {

        circle.setTranslateY(-RaceView.views[0][1]);

        for (int i = 0; i < Engine.gates.length; i++) {
            gates[i].setTranslateY(-RaceView.views[0][1]);
        }


    }

    public void translateViews1(ParallelTransition pt) {


        if (!once) {
            once = true;
            TranslateTransition translateTransition =
                    new TranslateTransition(new javafx.util.Duration(1000.0), circle);
            translateTransition.setByY(RaceView.views[1][1]);

            pt.getChildren().add(translateTransition);
            pt.play();

            for (int i = 0; i < Engine.gates.length; i++) {
                gates[i].setTranslateY(RaceView.views[1][1] - 100);
            }
        }

    }
}
