package sample;

import com.sun.javafx.fxml.builder.TriangleMeshBuilder;
import io.github.jdiemke.triangulation.DelaunayTriangulator;
import io.github.jdiemke.triangulation.Triangle2D;
import io.github.jdiemke.triangulation.Vector2D;
import javafx.animation.TranslateTransition;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Group;
import javafx.scene.PerspectiveCamera;
import javafx.scene.effect.Light;
import javafx.scene.effect.Lighting;
import javafx.scene.image.Image;
import javafx.scene.paint.Color;
import javafx.scene.paint.Material;
import javafx.scene.paint.PhongMaterial;
import javafx.scene.shape.*;
import javafx.util.Duration;

import java.awt.*;
import java.net.URL;
import java.util.*;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

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


        for (int i = 0; i < Engine.falls[1][1]; i++) {
            spheres[0] = new Sphere();
            spheres[0].setRadius(1.0f);
            PhongMaterial material = new PhongMaterial();
            material.setDiffuseColor(Color.BLUE);
            spheres[0].setMaterial(material);

            int randomNumX = ThreadLocalRandom.current().nextInt(-100, 100 + 1);

            int randomNumY = ThreadLocalRandom.current().nextInt(20, 80 + 1);

            spheres[0].setTranslateX(randomNumX);
            spheres[0].setTranslateY(randomNumY);
            spheres[0].setTranslateZ(Engine.falls[1][0]);

            group.getChildren().add(spheres[0]);
        }
        //Setting the properties of the Cylinder





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


        List<Vector2D> vector2DList = new ArrayList<>();
        HashMap<Integer, Integer> pointHeight = new HashMap<>();
        HashMap<Integer, Integer> pointIndices = new HashMap<>();
        List<Float> floats = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            int randomNumX = ThreadLocalRandom.current().nextInt(-100, 100 + 1);
            int randomNumY = ThreadLocalRandom.current().nextInt(0, 350 + 1);
            int rndHeight = ThreadLocalRandom.current().nextInt(0, 5 + 1);

            pointHeight.put(randomNumX*1000 + randomNumY, rndHeight);
            pointIndices.put(randomNumX*1000 + randomNumY, i);

            floats.add((float) randomNumX);
            floats.add(20.0f-rndHeight);
            floats.add((float) randomNumY);


            Vector2D d = new Vector2D(randomNumX, randomNumY);
            vector2DList.add(d);
        }


        try {

            DelaunayTriangulator triangulator = new DelaunayTriangulator(vector2DList);
            triangulator.triangulate();
            List<Triangle2D> triangle2DS = triangulator.getTriangles();


            //for(Triangle2D triangle2D: triangle2DS) {
                TriangleMesh mesh = new TriangleMesh();
                /*floats = new ArrayList<>();
                floats.add((float) triangle2D.a.x);
                floats.add(20.0f-pointHeight.get(((int) triangle2D.a.x)*1000+( (int) triangle2D.a.y)));
                floats.add((float) triangle2D.a.y);
                floats.add((float) triangle2D.b.x);
                floats.add(20.0f-pointHeight.get(((int) triangle2D.b.x)*1000+( (int) triangle2D.b.y)));
                floats.add((float) triangle2D.b.y);
                floats.add((float) triangle2D.c.x);
                floats.add(20.0f-pointHeight.get(((int) triangle2D.c.x)*1000+( (int) triangle2D.c.y)));
                floats.add((float) triangle2D.c.y);
                */
                float[] array = new float[floats.size()];
                for(int i = 0; i < floats.size(); i++) array[i] = floats.get(i);


                mesh.getPoints().addAll(array);

                float[] texture = {
                        0.00f, 0.00f,        // 0
                        1.00f, 0.00f,        // 1
                        0.00f, 1.00f};      //2


            List<Integer> listFaces = new ArrayList<>();
            for(Triangle2D triangle2D: triangle2DS) {
                if(ccw(new Point((int)triangle2D.a.x, (int) triangle2D.a.y),
                        new Point((int)triangle2D.b.x, (int) triangle2D.b.y),
                new Point((int)triangle2D.c.x, (int) triangle2D.c.y))>0) {
                    listFaces.add(pointIndices.get(((int) triangle2D.a.x) * 1000 + ((int) triangle2D.a.y)));
                    listFaces.add(0);
                    listFaces.add(pointIndices.get(((int) triangle2D.b.x) * 1000 + ((int) triangle2D.b.y)));
                    listFaces.add(1);
                    listFaces.add(pointIndices.get(((int) triangle2D.c.x) * 1000 + ((int) triangle2D.c.y)));
                    listFaces.add(2);
                } else {
                    listFaces.add(pointIndices.get(((int) triangle2D.a.x) * 1000 + ((int) triangle2D.a.y)));
                    listFaces.add(0);
                    listFaces.add(pointIndices.get(((int) triangle2D.c.x) * 1000 + ((int) triangle2D.c.y)));
                    listFaces.add(1);
                    listFaces.add(pointIndices.get(((int) triangle2D.b.x) * 1000 + ((int) triangle2D.b.y)));
                    listFaces.add(2);


                }
            }
//                int[] faces = {
//                        0,0, 1,  1,  2,  2};

            int[] faces = new int[listFaces.size()];
            for(int i = 0; i < listFaces.size(); i++) faces[i] = listFaces.get(i);

                mesh.getTexCoords().addAll(texture);
                mesh.getFaces().addAll(faces);



                MeshView view = new MeshView(mesh);

                PhongMaterial material = new PhongMaterial();
                material.setDiffuseColor(Color.LIGHTBLUE);

                //material.setDiffuseMap(new Image("white-water.jpg"));

                view.setMaterial(material);
                view.setDrawMode(DrawMode.FILL);
                view.setCullFace(CullFace.NONE);

            /*Light.Distant light = new Light.Distant();
            light.setAzimuth(-135.0f);

            Lighting l = new Lighting();
            l.setLight(light);
            l.setSurfaceScale(5.0f);


                view.setEffect(l);
*/

                //group.getChildren().add(view);

            //}


        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static int ccw(Point a, Point b, Point c) {
        return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    }

}
