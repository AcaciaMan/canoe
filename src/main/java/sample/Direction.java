package sample;

import java.time.Duration;
import java.time.Instant;

public class Direction {

    public Double angle = 0.0;
    public Double angleChange = 0.0;
    public Double maxAngle = 360.0;
    public Double maxSpeed = 2000.0;

    Instant startLEFT;
    long elapsed = 0;
    Instant finishUP;
    Instant startRIGHT;
    Instant finishDOWN;

    Instant timeNow;

    public Double getAngle() {
        calculateAngle();
        return angle;
    }

    public void calculateAngle() {
        timeNow = Instant.now();

        if(startLEFT!=null) {
            elapsed = Duration.between(startLEFT, timeNow).toMillis();
            startLEFT = timeNow;
            leftAngle(elapsed);
        } else if (startRIGHT!=null) {
            elapsed = Duration.between(startRIGHT, timeNow).toMillis();
            startRIGHT = timeNow;
            rightAngle(elapsed);
        } else {
            leftAngle(0);
        }

    }


    public void pressedLEFT() {
        if(startLEFT==null) {
            startLEFT = Instant.now();
        }
    }

    public void pressedRIGHT() {
        if(startRIGHT==null) {
            startRIGHT = Instant.now();
        }
    }

    public void releasedLEFT() {
        startLEFT=null;
    }

    public void releasedRIGHT() {
        startRIGHT=null;
    }

    public void leftAngle(long el) {
        angleChange = maxAngle*el/maxSpeed;
        angle = angle+angleChange;
        if (angle>maxAngle) angle = angle - maxAngle;
    }

    public void rightAngle(long el) {

        angleChange = -maxAngle*el/maxSpeed;
        angle = angle+angleChange;
        if (angle<0) angle = angle + maxAngle;
    }


}
