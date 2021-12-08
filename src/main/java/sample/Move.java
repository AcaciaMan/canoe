package sample;

import static java.lang.Math.cos;
import static java.lang.Math.sin;

public class Move {

    public Double vector;
    public Double angle;

    // sin(angle)=moveX/vector; moveX=sin(angle)*vector;
    // cos(angle)=moveY/vector; moveY=cos(angle)*vector;


    public Double getMoveX() {
        return sin(Math.toRadians(angle))*vector;
    }

    public Double getMoveY() {
        return cos(Math.toRadians(angle))*vector;
    }


}
