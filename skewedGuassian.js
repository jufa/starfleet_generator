var skewedGuassian = `
const float M_PI=3.1415926535897932384626433832795;
const float sqrt2Pi = sqrt(2.0 * M_PI);

float base(float skew, float x, float a, float b, float c, float d, float e) {
  return 1.0 / (a * sqrt2Pi) * exp( -(x*x)/2.0 ) * ( b*skew*x + c*skew*skew*x*x + d*skew*skew*skew*x*x*x + e );
}

float skewedGuassian(float skew, float x) {
  x+=1.0;
  if (x <= -3.0/skew) { return 0.0; }
  if (x <= -1.0/skew) { return base(skew, x, 8., 9.,  3.,  1.0/3.0, 9.); }
  if (x <=  1.0/skew) { return base(skew, x, 4., 3.,  0., -1.0/3.0, 4.); }
  if (x <=  3.0/skew) { return base(skew, x, 8., 9., -3.,  1.0/3.0, 7.); }
  return sqrt(2.0/M_PI) * exp( -(x*x)/2.0 ); 
}
`
module.exports = {
  skewedGuassian: skewedGuassian
};
