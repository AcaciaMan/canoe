package sample;

import java.time.Duration;
import java.time.Instant;

public class Speed {

    public Integer speed = 0;

    public Integer maxSpeed = 4;

    Instant startUP;
    long elapsedUP;
    Instant finishUP;
    Instant startDOWN;
    Instant finishDOWN;

    Instant timeNow;


    public Double getVector() {
        calculateSpeed();
        return 5.0 * speed / maxSpeed;
    }

    public void calculateSpeed() {
        timeNow = Instant.now();

        if(startUP!=null) {
            elapsedUP = Duration.between(startUP, timeNow).toMillis();
            if(elapsedUP>500) {
                addSpeed();
            }
        } else if (startDOWN!=null) {
            elapsedUP = Duration.between(startDOWN, timeNow).toMillis();
            if(elapsedUP>500) {
                downSpeed();
            }

        }
        else {
            slowDown();
        }

    }

    public void pressedUP() {
        //System.out.println("UP");
        if(startUP==null) {
            startUP = Instant.now();
        }
    }


    public void releasedUP() {
        startUP = null;
    }


    public void pressedDOWN() {
        if(startDOWN==null) {
            startDOWN = Instant.now();
        }
    }

    public void releasedDOWN() {
        startDOWN = null;
    }

    public void addSpeed() {
        if(speed<maxSpeed) speed++;
    }

    public void downSpeed() {
        if(speed>-maxSpeed) speed--;
    }


    public void slowDown() {
        if(speed>0) {
            speed--;
        }
        else if(speed<0) {
            speed++;
        }
    }
}
