class MapController < ApplicationController
  def get2dinfo
    lon,lat=params['lon'],params['lat']
    lon = '120.0' if lon.nil?
    lat = '30.0'  if lat.nil?
    user = User.find_by_sql("select gid, tbbh, dlmc, qsxz, qsdwmc, zldwmc, shape_leng, shape_area from dltb where ST_within( transform(geomFromText('POINT(#{lon} #{lat})',4326),2364), the_geom);")
    if user.size > 0 
      @user =  user[0]
    else
      render :template => "/map/2derror.html.erb"
    end  
  end
  
  def get2ddata
  end
    
end
