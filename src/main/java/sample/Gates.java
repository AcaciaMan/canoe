package sample;

import javafx.animation.TranslateTransition;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Group;
import javafx.scene.PerspectiveCamera;
import javafx.scene.shape.Cylinder;
import javafx.util.Duration;

import java.net.URL;
import java.util.ResourceBundle;

public class Gates implements Initializable {

   @FXML private Group group;
   @FXML private Cylinder[] cylinder = new Cylinder[Engine.gates.length];

    public PerspectiveCamera camera;

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        for (int i = 0; i < Engine.gates.length; i++) {
            cylinder[i] = new Cylinder();
            cylinder[i].setHeight(30.0f);
            cylinder[i].setRadius(5.0f);
            cylinder[i].setTranslateX(Engine.gates[i][0]);
            cylinder[i].setTranslateY(-5.0);
            cylinder[i].setTranslateZ(Engine.gates[i][1]);
        }
        //Setting the properties of the Cylinder


        group.getChildren().addAll(cylinder);



    }



}
