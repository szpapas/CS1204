class MapController < ApplicationController
  def get2ddata
  end
  
  #with template
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
  
  def get2dinfo_wx
    lon,lat=params['lon'],params['lat']
    lon = '120.0' if lon.nil?
    lat = '30.0'  if lat.nil?
    user = User.find_by_sql("select gid, tbbh, dlmc, qsxz, qsdwmc, zldwmc, shape_leng, shape_area from dltb where ST_within( transform(geomFromText('POINT(#{lon} #{lat})',4326),2364), the_geom);")
    if user.size > 0 
      @user =  user[0]
      render :template => "/map/get2dinfo_wx.html.erb"
    else
      render :template => "/map/2derror.html.erb"
    end  
  end
  
  def getxmdk_wx
    lon,lat,xmmc=params['lon'],params['lat'],params['xmmc']
    lon = '120.0' if lon.nil?
    lat = '30.0'  if lat.nil?
    user = User.find_by_sql("select gid, xh, pzwh, sfjs, xzqmc, nd, xz_tag, the_center from xmdk where xh = '#{xmmc}';")
    if user.size > 0 
      @user =  user[0]
      render :template => "/map/getxmdk_wx.html.erb"
    else
      render :template => "/map/2derror.html.erb"
    end  
  end
  
  def getuserinfo
    @users = User.find_by_sql("select id, email, username from users limit 1;")
  end
  
  def getreport
    @user = User.find_by_sql("select * from plans where id=#{params['task_id']};")[0]
    @images = User.find_by_sql("select * from xcimage where plan_id = #{params['task_id']};")
  end  
  
  def demoajax
  end
  
  def callajax
    User.find_by_sql("update plans set xcnr='#{params['xcnr']}', xcjg='#{params['xcjg']}', clyj='#{params['clyj']}' where id=#{params['task_id']}")
    render :text => "保存成功"
  end  
  
  def getpdfreport
    render :text => "/images/xcjl/xcjl_4208.pdf"
  end  
  
  def getabout
  end
  
  def getsupport
  end
  
  def gethelp
  end      
    
  #Ajax requests
  def get_plan_json
    username = params['username'] || ""
    if username == ""
      txt = ""
    else
      ts1 = Time.now.strftime('%Y-%m-%d')  
      ts2 = (Time.now + 86400*28).strftime('%Y-%m-%d')  
      if  username.include?('189')
        txt = ''
        iphone = username.gsub('+86','').gsub(' 86','')
        user = User.find_by_sql("select username from users where iphone='#{iphone}';")
        if user.size > 0 
          username = user[0].username
          plan = User.find_by_sql("select id, rwmc as xcmc, session_id, xcqy,xcfs,xcry as xcr, qrq as t_begin,zrq as t_end, zt, astext(transform(the_lines, 4326 )) as the_lines from plans where xcry like '%#{username}%' and zrq > date ('#{ts1}') and qrq < date('#{ts2}');")
        end
      else
        plan = User.find_by_sql("select id, rwmc as xcmc, session_id, xcqy,xcfs,xcry as xcr, qrq as t_begin,zrq as t_end, zt, astext(transform(the_lines, 4326 )) as the_lines from plans where xcry like '%#{username}%' and zrq > date ('#{ts1}') and qrq < date('#{ts2}');")
      end
            
      txt = plan.to_json.gsub(' 00:00:00', '')
    end
    render :text => {"mode" => params['mode'], "result" => txt}.to_json
  end
  
  #report_current_pos?username=18962381978&lonlat=120.769302%2031.672432&task_id=19389"
  def report_current_pos
    lonlat, task_id, username = params["lonlat"],params["task_id"], params['username'],  
    now = Time.now.strftime("%Y-%m-%d %H:%M:%S")
    User.find_by_sql("update plans set the_points=astext(transform(geomFromText('Point(#{lonlat})',4326),900913)), report_at= TIMESTAMP '#{now}' where id=#{task_id};")
    if username.include?'189'
      User.find_by_sql("update users set the_points=astext(transform(geomFromText('Point(#{lonlat})',4326),900913)), last_seen= TIMESTAMP '#{now}' where iphone='#{username}'; ")
    else  
      User.find_by_sql("update users set the_points=astext(transform(geomFromText('Point(#{lonlat})',4326),900913)), last_seen= TIMESTAMP '#{now}' where username='#{username}'; ")
    end
    render :text => {"mode" => params['mode'], "result" => 'Success'}.to_json
  end
  
  def getTaskPhotos
    user = User.find_by_sql("select id, plan_id, xmdk_id, yxmc, rq, tpjd, bz, astext(the_geom) as lonlat from xcimage where plan_id = #{params['task_id']};")
    txt = user.to_json
    render :text => {"mode" => params['mode'], "result" => txt}.to_json
  end  
  
  def uploadPhoto
    plan_id = params['plan_id']
    xmdk_id = params['xmdk_id']
    yxmc = "#{plan_id}_#{xmdk_id}_#{params['yxmc']}"
    geomString = "geomFromText('Point(#{params['lonlat']})',4326)"
    
    User.find_by_sql("insert into xcimage (plan_id, xmdk_id, yxmc, rq, bz, tpjd, the_geom) values (#{plan_id}, #{xmdk_id}, '#{yxmc}', TIMESTAMP '#{params['rq']}', '#{params['bz']}', '#{params['tpjd']}', #{geomString});")
    
    v = params['yx_file']
    
    pathname = "./dady/xctx/#{plan_id}_#{xmdk_id}_#{v.original_filename}"
    ff = File.new(pathname,"w+")
    ff.write(v.tempfile.read)
    ff.close
    
    system ("convert #{pathname} #{pathname.gsub('PNG','JPG')}")
    
    txt = "Success"
    render :text => {"mode" => params['mode'], "result" => txt}.to_json
  end  
  
  
  #report_task_state?username=+8618962381978&state=on&session_id=(null)&device=+8618936891840&mode=30" for81506 31.224941,2012-10-31 08:00:41\n", "task_id"=>"15438", "username"=>"18962381978"}
  def report_task_state
    state = params["state"]
    username = params["username"].gsub("+86","")
    if username.include?('189')
      user = User.find_by_sql("select username, iphone from users where iphone = '#{username}';")
      if user.size > 0
        username = user[0].username
      end
    end
    device = user[0].iphone
    txt = ''
    if state == "on" 
      #task_id, device_no, username
      time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
      session_id = params['session_id']
      plan = User.find_by_sql("select id, session_id, icon from plans where session_id='#{session_id}';")
      User.find_by_sql("update plans set username='#{username}', device='#{device}', taskbegintime=TIMESTAMP '#{time}',  zt='执行' where session_id ='#{session_id}';")
      
      User.find_by_sql("update plans set the_lines = null where session_id='#{session_id}';")
      User.find_by_sql("delete from location_points where session_id='#{session_id}';")
      
      
      txt = "Success:#{session_id}"
      
    elsif state=="off"
      session_id=params["session_id"]
      time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
      User.find_by_sql("update plans set taskendtime=TIMESTAMP '#{time}',  zt='完成' where session_id='#{session_id}';")

      #这个地方是Multiple-Line, 先忽略过去
      update_line(session_id)
      
      update_time_and_length(session_id)
      
      
      user = User.find_by_sql("select xmdk_count, photo_count, xclc, xcys from plans where session_id = '#{session_id}';")
      #可以更新其他内容
      txt = user[0].to_json.gsub("null","\"0.0\"")
      
    elsif state == "reset" 
      #task_id, device_no, username
      time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
      session_id = params['session_id']
      plan = User.find_by_sql("select id, session_id, icon from plans where session_id='#{session_id}';")
      User.find_by_sql("update plans set username='#{username}', device='#{device}', taskbegintime=TIMESTAMP '#{time}',  zt='计划' where session_id ='#{session_id}';")

      User.find_by_sql("update plans set the_lines = null, xclc = 0.0, xcys = null, photo_count = 0, xmdk_count = 0 where session_id='#{session_id}';")
      User.find_by_sql("delete from location_points where session_id='#{session_id}';")
      User.find_by_sql("delete from xcimages where plan_id = #{plan[0].id}")

      txt = "Success:#{session_id}"  
      
    else  
      txt = "Failure:#{session_id}"     
    end
    render :text => {"mode" => params['mode'], "result" => txt}.to_json   
  end
  
  def save_report
    session_id =  params['session_id']
    xcnr = params['xcnr'] || ""
    xcjg = params['xcjg'] || ""
    clyj = params['clyj'] || ""
    User.find_by_sql("update plans set xcnr='#{xcnr}', xcjg='#{xcjg}', clyj = '#{clyj}' where session_id='#{session_id}';")
    render :text => 'Success'
  end

  def get_xmdk_json
    xmdks = User.find_by_sql("select gid as xmdk_id, xh as xmmc, sfjs as jszt, pzwh as dkmc,  astext(transform(the_geom, 4326)) as the_geom, astext(centroid(transform(the_geom,4326))) as the_center from xmdk order by gid;")
    txt = xmdks.to_json.gsub('"POLYGON', '"MULTIPOLYGON(')
    render :text => {"mode" => params['mode'], "result" => txt}.to_json  
  end  
  
  def get_inspect_json
    
    sql_str = "select inspects.*, plans.xmdk from inspects inner join plans on inspects.plan_id = plans.id where "
    if !params['username'].nil?
      sql_str = sql_str+" xcry like '%#{params['username']}%' "
    elsif !params['task_id'].nil?
      sql_str = sql_str+" and plan_id=#{params['plan_id']} "
    elsif !params['xmdk_id'].nil?
      sql_str = sql_str+" and xmdk_id=#{params['xmdk_id']} "
    end

    inspects = User.find_by_sql("#{sql_str} order by id;")
    render :text => inspects.to_json
  end
  
  def get_2dinfo
    #define OFFSET_LAT (-0.0020264277677)
    #define OFFSET_LONG 0.004228694067
    
    lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677 
    user = User.find_by_sql("select gid, dlmc from dltb where st_within(transform(geomFromText('POINT(#{lon} #{lat})',4326),2364), the_geom);")
    
    user2= User.find_by_sql("select gid, dlmc from jbntghtb where st_within(transform(geomFromText('POINT(#{lon} #{lat})',4326),2385), the_geom);")
    
    txt = ''
    if user.size > 0
      txt = "地类:#{user[0].dlmc}"
    end
    
    if user2.size > 0
      txt = txt + " 规划:#{user2[0].dlmc}"
    end
    txt = "#{lon} #{lat}" if txt.length == 0
    ss = {"mode" => "22", "result" => txt}

    render :text => ss.to_json  
  end
  
  
  def get_2dinfo_wx
    #define OFFSET_LAT (-0.0020264277677)
    #define OFFSET_LONG 0.004228694067
    
    lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677 
    user = User.find_by_sql("select gid, dlmc from dltb where st_within(transform(geomFromText('POINT(#{lon} #{lat})',4326),2364), the_geom);")
    
    txt = ''
    if user.size > 0
      txt = "地类:#{user[0].dlmc}"
    end
    
    txt = "#{"%05.5f" % lon.to_f} #{"%05.5f" % lat.to_f}" if txt.length == 0
    ss = {"mode" => "22", "result" => txt}

    render :text => ss.to_json  
  end
  
  #Parameters: {"username"=>"18962381978", "task_id"=>"19388", "data"=>"121.480263 31.224056,2012-10-31 08:22:08\n"}
  def report_line_pos
    task_id, username = params['task_id'], params['username'].gsub('+86','')
    
    sessions = User.find_by_sql("select session_id from plans where id = #{task_id};")
    
    if sessions.size > 0 
      session_id = sessions[0]['session_id']
      lines = params['data'].split("\n");
      k = lines.count-1
      while k >= 0
        ss = /(.*)\s+(.*),(.*)/.match(lines[k])
        lon_lat=User.find_by_sql("select astext(transform(geomFromText('Point(#{ss[1]} #{ss[2]})',4326),900913));")[0].astext.gsub('POINT(','').gsub(')','')
        User.find_by_sql("insert into location_points(session_id, lon_lat, report_time ) values ('#{session_id}','#{lon_lat}','#{ss[3]}');")  
        k = k-1;
      end
    
      #更新Plan
      user=User.find_by_sql("select lon_lat, report_time from location_points where session_id='#{session_id}' order by report_time desc limit 1;")
      if user.size > 0
        User.find_by_sql("update plans set the_points=geomFromText('Point(#{user[0].lon_lat})',900913), report_at= TIMESTAMP '#{user[0].report_time}' where session_id='#{session_id}';")
      
        #update users
        if username.include?("189")
          User.find_by_sql("update users set  the_points=geomFromText('Point(#{user[0].lon_lat})',900913), last_seen = TIMESTAMP '#{user[0].report_time}' where iphone = '#{username}';")
        else
          User.find_by_sql("update users set  the_points=geomFromText('Point(#{user[0].lon_lat})',900913), last_seen = TIMESTAMP '#{user[0].report_time}' where username = '#{username}';")
        end
      
      end
    
      #Create_Line from points
      update_line(session_id)
    
      #Set last update time
      out = {}
      user=User.find_by_sql("select lon_lat, report_time from location_points where session_id='#{session_id}' order by report_time desc limit 1;")
      out['create_at'] = user[0].report_time
    
      render :text => {"mode" => params['mode'], "result" => out.to_json}.to_json
    else
      render :text => {"mode" => params['mode'], "result" => "no_session"}.to_json
    end    
  end
  
  #iphone 请求路线点
  def get_task_line
    user = User.find_by_sql("select astext(transform(the_lines, 4326 ))  from plans where id=#{params['task_id']} and the_lines is not null;")
	  txt = ''
	  if user.size > 0
	    if !user[0].astext.nil? 
	      txt = user[0].astext
	    end
	  end  
	  ss = {"mode" => "20", "result" => txt}
	  render :text => ss.to_json
  end  
  
  def get_task_inspect
    user = User.find_by_sql("select id, plan_id, xmdk_id, xh as xmmc, astext( transform(geomFromText(the_center,900913),4326) ) as the_center, tpsl as c_photo from inspects inner join xmdk on xmdk_id = xmdk.gid where plan_id=#{params['task_id']};")
    
	  txt = ''
	  if user.size > 0
	    txt = user.to_json
	  end
	  
	  ss = {"mode" => "24", "result" => txt}
	  render :text => ss.to_json
  end
  
  def get_task_photos
    user = User.find_by_sql(" where plan_id=#{params['task_id']};")
    
	  txt = ''
	  if user.size > 0
	    txt = user.to_json
	  end
	  
	  ss = {"mode" => "30", "result" => txt}
	  render :text => ss.to_json
  end
  
  def add_new_xmdk
    task_id, xmmc, lat, lon, xmms = params['task_id'], params['xmmc'], params['lat'], params['lon'], params['xmms']
    nd  = Time.now.year
    
    user = User.find_by_sql("select xcqy from plans where id = '#{task_id}';")
    xzqmc = user[0]['xcqy']
    
    the_geom = "transform( buffer(geomFromText('Point(#{lon} #{lat})',4326),0.0000898315280011275),900913)"
    the_center = "astext( transform(geomFromText('Point(#{lon} #{lat})',4326),900913)  ) "
    
    #Add xmdk with xz_tag = 1 
    user = User.find_by_sql("insert into xmdk (xh, sfjs, the_geom, the_center, xzqmc, nd, xz_tag) values ('#{xmmc}','#{xmms}', #{the_geom}, #{the_center}, '#{xzqmc}', '#{nd}', '1') returning gid;")
    
    gid = user[0]['gid']
    
    user = User.find_by_sql("insert into inspects (plan_id, xmdk_id, xcrq) values (#{task_id}, #{gid}, TIMESTAMP '#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}') returning id;")
    inspect_id = user[0]['id']
    ss = {"mode" => "23", "result" => "gid:#{gid},inspect_id:#{inspect_id}"}
    render :text => ss.to_json
  end
 
  #help functions
  def update_line(session_id)
    user = User.find_by_sql("select lon_lat from location_points where session_id='#{session_id}' order by id;")
    if user.size > 2 
      points=[]
      for k in 0..user.size-1 
        points[k]=user[k].lon_lat
      end
      geomtext = "geomFromText('LINESTRING(#{points.join(',')})',900913)"
      User.find_by_sql("update plans set the_lines=#{geomtext} where session_id='#{session_id}';")
    end
  end
  
  def update_time_and_length(session_id)
    plans = User.find_by_sql("select id from plans where session_id = '#{session_id}';" )
    
    if plans.size > 0
      plan_id = plans[0].id
      User.find_by_sql("update plans set xclc=length(the_lines), xcys = (taskendtime-taskbegintime) where session_id = '#{session_id}';")
      User.find_by_sql("update plans set photo_count = (select count(*) from xcimage where plan_id = #{plan_id}) where id = #{plan_id};")
    end
    
  end
  
  
  
  def get_nearby_xmdk
    user = User.find_by_sql("select gid, xh, ST_distance(transform(geomfromtext('POINT(#{params['lonlat']})',4326),900913), the_geom) as dist from xmdk order by dist limit 10;")
    txt = ''
    for k in 0..user.count-1
      dd = user[k]
      txt = txt + "#{dd['gid']} #{dd['xh']} (#{dd['dist'].to_i}米)\n"
    end  
    render :text => txt[0..-2]
  end
 
end
