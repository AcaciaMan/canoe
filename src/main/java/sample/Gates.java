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
   @FXML private Cylinder cylinder;
    @FXML private Cylinder cylinder2;

    public PerspectiveCamera camera;

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        cylinder = new Cylinder();
        //Setting the properties of the Cylinder
        cylinder.setHeight(30.0f);
        cylinder.setRadius(5.0f);

        cylinder2 = new Cylinder();
        cylinder2.setHeight(30.0f);
        cylinder2.setRadius(5.0f);

        group.getChildren().addAll(cylinder, cylinder2);



        TranslateTransition tt = new TranslateTransition(new Duration(50.0), cylinder);
        tt.setByX(15.0);
        tt.setByY(-5.0);
        tt.setByZ(300.0);

        tt.play();

        TranslateTransition tt2 = new TranslateTransition(new Duration(50.0), cylinder2);
        tt2.setByX(45.0);
        tt2.setByY(-5.0);
        tt2.setByZ(300.0);

        tt2.play();


    }



}
