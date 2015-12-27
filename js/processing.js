var MAP_SIZE = 100;
var SIZE = 10;
var WAGGON_SIZE = 0.4*SIZE;
var LINK_SIZE = 0.2*SIZE;
var DELTA = 2;
var CA = [ 0, 0 ];
var SA = [ 0, 0 ];

var NUM_TRACK_SEGMENTS = 0;
var DIRECTION_STRAIGHT = 0;
var DIRECTION_LEFT = 1;
var DIRECTION_RIGHT = 2;
var track = [];

var NUM_TRAIN_SEGMENTS = 7;
var X1 = [];
var Y1 = [];
var X2 = [];
var Y2 = [];

var lengths = [ SIZE, SIZE*Math.PI/4, SIZE*Math.PI/4 ];

var DX = [
 [   SIZE,  0      ],
 [ SIZE/2,  SIZE/2 ],
 [ SIZE/2, -SIZE/2 ]
];

var DY = [
 [       0, SIZE ],
 [ -SIZE/2, SIZE/2 ],
 [  SIZE/2, SIZE/2 ]
];

var TX = [
 [ 1,  0 ],
 [ 0,  1 ],
 [ 0, -1 ]
];

var TY = [
 [  0, 1 ],
 [ -1, 0 ],
 [  1, 0 ]
];

var DA = [ 0, -Math.PI/2, Math.PI/2 ];

var TRACK_LENGTH;
var curr_dist = 0;



function setup()
{
  var i;
  var a;

  //EHOH? size(7*SIZE, 4*SIZE);
  
  TRACK_LENGTH = 0;
  for (i=0; i<NUM_TRACK_SEGMENTS; i++)
    TRACK_LENGTH += lengths[track[i]];
  a = 2*Math.asin(1.0*WAGGON_SIZE/SIZE);
  CA[0] = Math.cos(a);
  SA[0] = Math.sin(a);
  a = 2*Math.asin(1.0*LINK_SIZE/SIZE);
  CA[1] = Math.cos(a);
  SA[1] = Math.sin(a);
  //X1 = new float[2*NUM_TRAIN_SEGMENTS-1];
  //Y1 = new float[2*NUM_TRAIN_SEGMENTS-1];
  //X2 = new float[2*NUM_TRAIN_SEGMENTS-1];
  //Y2 = new float[2*NUM_TRAIN_SEGMENTS-1];
}


void draw()
{
  var i, j, ni=0, foundInNext, n;
  /*float x=0, y=0, a, tx, ty, tmp, d, l, h;
  float x0, y0, nx0=0, ny0=0, nx1=0, nx2=0, ny1=0, ny2=0, ntx=0, nty=0, nx=0, ny=0;
  float segmentLen;*/
  
  //drawTracks();

  /*x0 = SIZE;
  y0 = SIZE/2;
  tx = 1;
  ty = 0;
  i = 0;
  a = 0;
  d = curr_dist;*/

  // Find current segment index (i), orientation (tx, ty, a) and offset withing the segment (d)

  /*while (d > lengths[track[i]]) {
    j = track[i];
    x0 += DX[j][0]*tx + DX[j][1]*ty;
    y0 += DY[j][0]*tx + DY[j][1]*ty;
    tmp = TX[j][0]*tx + TX[j][1]*ty;
    ty  = TY[j][0]*tx + TY[j][1]*ty;
    tx  = tmp;
    a += DA[j];
    d -= lengths[j];
    i++;
  }*/

  // Find current starting position (x, y)

  /*switch (track[i]) {
    case 0:
    x = x0 + d*tx;
    y = y0 + d*ty;
    break;
    case 1:
    tmp = 2*d/SIZE;
    x = x0 + 0.5*SIZE*ty + 0.5*SIZE*cos(PI/2-tmp+a);
    y = y0 - 0.5*SIZE*tx + 0.5*SIZE*sin(PI/2-tmp+a);
    break;
    case 2:
    tmp = 2*d/SIZE;
    x = x0 - 0.5*SIZE*ty+0.5*SIZE*cos(a+tmp-PI/2);
    y = y0 + 0.5*SIZE*tx+0.5*SIZE*sin(a+tmp-PI/2);
    break;
  }*/

  /*foundInNext = 1;

  for (n=0; n<2*NUM_TRAIN_SEGMENTS-1; n++) {

    if ((n & 1) == 0)
      segmentLen = WAGGON_SIZE;
    else
      segmentLen = LINK_SIZE;
    
    // Find next segment index (ni), orientation (ntx, nty), position (nx0, ny0) and boundaries (nx1, ny1, nx2, ny2)
  
    if (foundInNext == 1) {
      j = track[i];
      nx0 = x0 + DX[j][0]*tx + DX[j][1]*ty;
      ny0 = y0 + DY[j][0]*tx + DY[j][1]*ty;
      ntx = TX[j][0]*tx + TX[j][1]*ty;
      nty = TY[j][0]*tx + TY[j][1]*ty;
      nx1 = nx0 + SIZE*0.5*nty;
      ny1 = ny0 - SIZE*0.5*ntx;
      nx2 = nx0 + SIZE*ntx - SIZE*0.5*nty;
      ny2 = ny0 + SIZE*nty + SIZE*0.5*ntx;
      if (nx1 > nx2) {
        tmp = nx1;
        nx1 = nx2;
        nx2 = tmp;
      }
      if (ny1 > ny2) {
        tmp = ny1;
        ny1 = ny2;
        ny2 = tmp;
      }
      ni = i + 1;
      if (ni >= NUM_TRACK_SEGMENTS)
        ni = 0;
    }
  
    // Try to find the next point in the next segment
    
    foundInNext = 0;
    switch (track[ni]) {
      case 0:
      d = (ny0 - y)*ntx + (x - nx0)*nty;
      if (segmentLen*segmentLen >= d*d) {
        tmp = sqrt(segmentLen*segmentLen - d*d);
        nx = -nty*d + ntx*tmp + x;
        ny =  ntx*d + nty*tmp + y;
        if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2) {
          foundInNext = 1;
        } else {
          nx = -nty*d - ntx*tmp + x;
          ny =  ntx*d - nty*tmp + y;
          if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2)
            foundInNext = 1;
        }
      }
      break;
      case 1:
      tmp = (nx0+0.5*SIZE*nty-x);
      d = tmp*tmp;
      tmp = (ny0-0.5*SIZE*ntx-y);
      d = sqrt(d + tmp*tmp);
      if (d <= segmentLen + 0.5*SIZE) {
        l = 0.5*(segmentLen*segmentLen - 0.25*SIZE*SIZE + d*d)/d;
        h = sqrt(segmentLen*segmentLen - l*l);
        l = l/d;
        h = h/d;
        nx = l*(nx0+0.5*SIZE*nty-x) + h*(ny0-0.5*SIZE*ntx-y) + x;
        ny = l*(ny0-0.5*SIZE*ntx-y) - h*(nx0+0.5*SIZE*nty-x) + y;
        if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2) {
          foundInNext = 1;
        } else {
          nx = l*(nx0+0.5*SIZE*nty-x) - h*(ny0-0.5*SIZE*ntx-y) + x;
          ny = l*(ny0-0.5*SIZE*ntx-y) + h*(nx0+0.5*SIZE*nty-x) + y;
          if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2)
            foundInNext = 1;
        }
      }
      break;
      case 2:
      tmp = (nx0-0.5*SIZE*nty-x);
      d = tmp*tmp;
      tmp = (ny0+0.5*SIZE*ntx-y);
      d = sqrt(d + tmp*tmp);
      if (d <= segmentLen + 0.5*SIZE) {
        l = 0.5*(segmentLen*segmentLen - 0.25*SIZE*SIZE + d*d)/d;
        h = sqrt(segmentLen*segmentLen - l*l);
        l = l/d;
        h = h/d;
        nx = l*(nx0-0.5*SIZE*nty-x) + h*(ny0+0.5*SIZE*ntx-y) + x;
        ny = l*(ny0+0.5*SIZE*ntx-y) - h*(nx0-0.5*SIZE*nty-x) + y;
        if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2) {
          foundInNext = 1;
        } else {
          nx = l*(nx0-0.5*SIZE*nty-x) - h*(ny0+0.5*SIZE*ntx-y) + x;
          ny = l*(ny0+0.5*SIZE*ntx-y) + h*(nx0-0.5*SIZE*nty-x) + y;
          if (nx >= nx1 && nx <= nx2 && ny >= ny1 && ny <= ny2)
            foundInNext = 1;
        }
      }
      break;
    }
  
    // If not found try in the current segment
  
    if (foundInNext == 0) {
      switch (track[i]) {
      case 0:
        nx = x + segmentLen*tx;
        ny = y + segmentLen*ty;
        break;
      case 1:
        nx = x - (x0+0.5*SIZE*ty);
        ny = y - (y0-0.5*SIZE*tx);
        tmp = nx*CA[n&1] + ny*SA[n&1];
        ny =  ny*CA[n&1] - nx*SA[n&1];
        nx = tmp;
        nx += (x0+0.5*SIZE*ty);
        ny += (y0-0.5*SIZE*tx);
        break;
      case 2:
        nx = x - (x0-0.5*SIZE*ty);
        ny = y - (y0+0.5*SIZE*tx);
        tmp = nx*CA[n&1] - ny*SA[n&1];
        ny =  nx*SA[n&1] + ny*CA[n&1];
        nx = tmp;
        nx += (x0-0.5*SIZE*ty);
        ny += (y0+0.5*SIZE*tx);
        break;
      }
    }
    
    X1[n] = x;
    Y1[n] = y;
    X2[n] = nx;
    Y2[n] = ny;
    
    x = nx;
    y = ny;
    if (foundInNext == 1) {
      x0 = nx0;
      y0 = ny0;
      tx = ntx;
      ty = nty;
      i = ni;
    }
  }*/

  
  /*stroke(#301000);
  strokeWeight(6);
  for (i=0; i<NUM_TRAIN_SEGMENTS-1; i++) {
    line(X1[2*i+1], Y1[2*i+1], X2[2*i+1], Y2[2*i+1]);
  }
  strokeWeight(2);
  for (i=0; i<NUM_TRAIN_SEGMENTS; i++) {
    pushMatrix();
    translate(0.5*(X1[2*i]+X2[2*i]), 0.5*(Y1[2*i]+Y2[2*i]));
    h = atan2(Y2[2*i]-Y1[2*i], X2[2*i]-X1[2*i]);
    rotate(h+PI);
    if (i == 0) {
      stroke(#000000);
      fill(#208020);
      rect(-0.6*WAGGON_SIZE, -0.35*WAGGON_SIZE, 1.35*WAGGON_SIZE, 0.7*WAGGON_SIZE, 10);
      rect(-0.65*WAGGON_SIZE, -0.4*WAGGON_SIZE, 0.65*WAGGON_SIZE, 0.8*WAGGON_SIZE, 10);
      fill(#104810);
      ellipse(0.4*WAGGON_SIZE, 0, 0.2*WAGGON_SIZE, 0.2*WAGGON_SIZE);
    }
    else {
      stroke(#000000);
      fill(#c03020);
      rect(-0.71*WAGGON_SIZE, -0.35*WAGGON_SIZE, 1.3*WAGGON_SIZE, 0.7*WAGGON_SIZE, 10);
    }
    popMatrix();
  }*/

  /*curr_dist -= DELTA;
  if (curr_dist < 0)
    curr_dist += TRACK_LENGTH;*/
}

