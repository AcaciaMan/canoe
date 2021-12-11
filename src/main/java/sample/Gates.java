package sample;

import javafx.animation.TranslateTransition;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Group;
import javafx.scene.PerspectiveCamera;
import javafx.scene.paint.Color;
import javafx.scene.paint.Material;
import javafx.scene.paint.PhongMaterial;
import javafx.scene.shape.Box;
import javafx.scene.shape.Cylinder;
import javafx.scene.shape.Sphere;
import javafx.util.Duration;

import java.net.URL;
import java.util.ResourceBundle;

public class Gates implements Initializable {

   @FXML private Group group;
   @FXML private Cylinder[] cylinder = new Cylinder[Engine.gates.length];
   @FXML private Sphere[] spheres = new Sphere[20];

   public int[][] spherePoints = {{-100,0}, {-100,20}, {100,0}, {100,20},
           {-10,5}, {-15,15}, {-80,10}, {-50,17},
           {30,20}, {50,15}, {65,0}, {95,11},
           {0,0}, {0,20}, {0,7}, {0,14},
           {-65,20}, {-65,0}, {15,20}, {15,0}
   };

   @FXML private Box[] stones = new Box[1];

   public int[][] stonePoints = {{0,750,20}};

    public PerspectiveCamera camera;

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        for (int i = 0; i < Engine.gates.length; i++) {
            cylinder[i] = new Cylinder();
            cylinder[i].setHeight(30.0f);
            cylinder[i].setRadius(2.5f);
            PhongMaterial material = new PhongMaterial();
            if(Engine.gates[i][2]==0) {
               material.setDiffuseColor(Color.GREEN);
            } else {
                material.setDiffuseColor(Color.RED);
            }
            cylinder[i].setMaterial(material);

            cylinder[i].setTranslateX(Engine.gates[i][0]);
            cylinder[i].setTranslateY(Engine.gates[i][3]);
            cylinder[i].setTranslateZ(Engine.gates[i][1]);
        }
        //Setting the properties of the Cylinder


        group.getChildren().addAll(cylinder);


        for (int i = 0; i < spheres.length; i++) {
            spheres[i] = new Sphere();
            spheres[i].setRadius(1.0f);
            PhongMaterial material = new PhongMaterial();
            material.setDiffuseColor(Color.BLUE);
            spheres[i].setMaterial(material);

            spheres[i].setTranslateX(spherePoints[i][0]);
            spheres[i].setTranslateY(spherePoints[i][1]);
            spheres[i].setTranslateZ(Engine.falls[0][0]);
        }
        //Setting the properties of the Cylinder


        group.getChildren().addAll(spheres);


        for (int i = 0; i < stones.length; i++) {
            stones[i] = new Box();


            stones[i].setHeight(30.0);
            stones[i].setWidth(60.0);
            stones[i].setDepth(10.0);

            stones[i].setTranslateX(stonePoints[i][0]);
            stones[i].setTranslateY(stonePoints[i][2]);
            stones[i].setTranslateZ(stonePoints[i][1]);
        }

        group.getChildren().addAll(stones);

    }



}
