var pcurve = `
//
// Description : skewed distribution generator
//      Author : Iñigo Quiles 
//  Maintainer : 
//     Lastmod : 
//     License :  www.iquilezles.org/www/articles/functions/functions.htm 

float pcurve( float x, float a, float b ){
  float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
  return k * pow( x, a ) * pow( 0.984-x, b );
}
`
module.exports = {
    pcurve: pcurve
};
