package sample;

import javafx.animation.ParallelTransition;
import javafx.animation.TranslateTransition;
import javafx.scene.shape.Circle;

public class RaceView {

    public static int[][] views = {{Engine.frameLength/2,100},{Engine.frameLength/2,300},
            {Engine.frameLength/2,700}, {Engine.frameLength/2,1100}
    };

    public Circle circle;

    public Circle[] gates;

    public boolean once = false;

    public int stage = 1;

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

    public void translateViewsStage(ParallelTransition pt, double boatY, double prevBoatY) {


        if(stage>=views.length) return;

        if(Double.compare(views[stage][1],-boatY) <= 0 && Double.compare(views[stage][1], -prevBoatY) > 0 ) {

            TranslateTransition translateTransition =
                    new TranslateTransition(new javafx.util.Duration(1000.0), circle);
            if(stage>=2) {
                translateTransition.setByY(views[stage][1] - views[stage - 1][1]);
            } else if(stage==1) {
                translateTransition.setByY(views[stage][1]);
            }

            pt.getChildren().add(translateTransition);
            pt.play();

            for (int i = 0; i < Engine.gates.length; i++) {
                gates[i].setTranslateY(views[stage][1] - 100);
            }

            stage++;
        }


    }

}
