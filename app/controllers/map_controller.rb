class MapController < ApplicationController
  def get2ddata
  end
  
  #with template
  def get2dinfo
    if params['map_type'].to_i == 1
      lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677
    else
      lon, lat = params['lon'].to_f , params['lat'].to_f 
    end
    
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
    #lon,lat=params['lon'],params['lat']
    if params['map_type'].to_i == 1
      lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677
    else
      lon, lat = params['lon'].to_f , params['lat'].to_f 
    end     
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
  
  def getxmdk_wx_old
    
    if params['map_type'].to_i == 1
      lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677
    else
      lon, lat = params['lon'].to_f , params['lat'].to_f 
    end
    
    xmmc=params['xmmc']
    
    lon = '120.0' if lon.nil?
    lat = '30.0'  if lat.nil?
    user = User.find_by_sql("select gid, xmmc, pzwh, yddw, tdzl, dkmj, jlrq, sfjs, xzqmc, nd, xz_tag, the_center from xmdks where xmmc= '#{xmmc}';")
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
    @user   = User.find_by_sql("select * from plans where id=#{params['task_id']};")[0]
    @images = User.find_by_sql("select * from xcimage where plan_id = #{params['task_id']};")
    @xmdks  = User.find_by_sql("select xmdks.* from inspects inner join xmdks on inspects.xmdk_Id = xmdks.gid where plan_id = #{params['task_id']};")
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
  

  
  def makeSelect
  end
  

    
  #Ajax requests
  def get_plan_json
    username = params['username'] || ""
    if username == ""
      txt = ""
    else
      ts1 = Time.now.strftime('%Y-%m-%d')  
      ts2 = (Time.now + 86400*28).strftime('%Y-%m-%d')  
      if  username.include?('18')
        txt = ''
        iphone = username.gsub('+86','').gsub(' 86','')
        user = User.find_by_sql("select username from users where iphone='#{iphone}';")
        if user.size > 0 
          username = user[0].username
        end

        plan = User.find_by_sql("select id, rwmc as xcmc, session_id, xcqy,xcfs,xcry as xcr, qrq as t_begin,zrq as t_end, zt, astext(transform(the_lines, 4326 )) as the_lines, taskbegintime as t_date1, taskendtime as t_date2, report_at as t_report, photo_count, xmdk_count, xclc, xcys from plans where xcry like '%#{username}%' and zrq > date ('#{ts1}') and qrq < date('#{ts2}');")
      end
      txt = plan.to_json.gsub(' 00:00:00', '')
    end
    render :text => {"mode" => params['mode'], "result" => txt}.to_json
  end
  
  #report_current_pos?username=18962381978&lonlat=120.769302%2031.672432&task_id=19389"
  def report_current_pos
    lonlat, task_id, username = params["lonlat"],params["task_id"], params['username'],  
    now = Time.now.strftime("%Y-%m-%d %H:%M:%S")
    
    
    User.find_by_sql("update plans set the_points=transform(geomFromText('Point(#{lonlat})',4326),900913), report_at= TIMESTAMP '#{now}' where id=#{task_id};")
    if username.include?'18'
      User.find_by_sql("update users set the_points=transform(geomFromText('Point(#{lonlat})',4326),900913), last_seen= TIMESTAMP '#{now}' where iphone='#{username}'; ")
    else  
      User.find_by_sql("update users set the_points=transform(geomFromText('Point(#{lonlat})',4326),900913), last_seen= TIMESTAMP '#{now}' where username='#{username}'; ")
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
    
    #Add plan_id, xmdk_id to inspects
    user = User.find_by_sql("select count(*) from inspects where plan_id = #{plan_id} and xmdk_id = #{xmdk_id};")
    
    if user[0].count.to_i == 0
      user = User.find_by_sql("insert into inspects (plan_id, xmdk_id, xcrq) values (#{plan_id}, #{xmdk_id}, TIMESTAMP '#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}') returning id;")
    else
      user = User.find_by_sql("select count(*) from xcimage where plan_id = #{plan_id} and xmdk_id = #{xmdk_id};")
      User.find_by_sql("update inspects set tpsl = #{user[0].count}")
    end
    
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
    if username.include?('18')
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
      User.find_by_sql("delete from xcimage where plan_id = #{plan[0].id}")

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
    xmdks = User.find_by_sql("select gid as xmdk_id, xmmc, sfjs as jszt, pzwh as dkmc,  astext(transform(the_geom, 4326)) as the_geom, astext(centroid(transform(the_geom,4326))) as the_center from xmdks order by gid;")
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
    
    if params['map_type'].to_i == 1
      lon, lat = params['lon'].to_f - 0.004228694067, params['lat'].to_f + 0.0020264277677
    else
      lon, lat = params['lon'].to_f , params['lat'].to_f 
    end
    
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
        if username.include?("18")
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
    user = User.find_by_sql("select id, plan_id, xmdk_id, xmmc, astext( transform(geomFromText(the_center,900913),4326) ) as the_center, tpsl as c_photo from inspects inner join xmdks on xmdk_id = xmdk.gid where plan_id=#{params['task_id']};")
    
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
    xmmc, lat, lon, xmms = params['xmmc'], params['lat'], params['lon'], params['xmms']
    nd  = Time.now.year
    
    task_id = params['task_id'] || '0'
    
    if task_id.to_i > 0 
      user = User.find_by_sql("select xcqy from plans where id = '#{task_id}';")
      xzqmc = user[0]['xcqy']
    else
      xzqmc = ""
      
      
    end
      
    the_geom = "transform( buffer(geomFromText('Point(#{lon} #{lat})',4326),0.0000898315280011275),900913)"
    the_center = "astext( transform(geomFromText('Point(#{lon} #{lat})',4326),900913)  ) "
    
    #Add xmdk with xz_tag = 1 
    user = User.find_by_sql("insert into xmdks (xmmc, sfjs, the_geom, the_center, xzqmc, nd, xz_tag) values ('#{xmmc}','#{xmms}', #{the_geom}, #{the_center}, '#{xzqmc}', '#{nd}', '1') returning gid;")
    
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
    user = User.find_by_sql("select gid, xmmc, ST_distance(transform(geomfromtext('POINT(#{params['lonlat']})',4326),900913), the_geom) as dist from xmdks order by dist limit 10;")
    txt = ''
    for k in 0..user.count-1
      dd = user[k]
      txt = txt + "#{dd['gid']} #{dd['xmmc']} (#{dd['dist'].to_i}米)\n"
    end  
    render :text => txt[0..-2]
  end
  
  def query_lines
    render :text => "Success"
  end
  
  #{"cjqk"=>"g", "qkje"=>"a", "dj_dj"=>"11", "dkdz"=>"d", "pfwh"=>"111", "cjqrsbh"=>"121321", "tztx"=>"内资", "yt"=>"住宅用地", "yjl"=>"111", "cjj_mwj"=>"111", "znjqk"=>"d", "htbh"=>"111", "crfapzrq"=>"2013-02-13", "ydb_id"=>"", "bz"=>"444", "dkwz"=>"7", "lxr"=>"4", "crf"=>"2", "qtyq"=>"fff", "sjjgsj"=>"2013-02-18", "ydjgsj"=>"2013-02-19", "sjjdsj"=>"2013-02-11", "ydjdsj"=>"2013-02-07", "wdqk"=>"s", "bzj"=>"100", "dknz"=>"n", "lhl"=>"1.5", "jsmd"=>"1.5", "qsly"=>"增量", "jsxmmc"=>"6", "zxtxmj"=>"111", "zxtxbl"=>"20", "sjkgsj"=>"2013-02-15", "cjj_lmj"=>"11", "dj_lmj"=>"NaN", "dh"=>"5", "gdrq"=>"2013-02-12", "zdmj"=>"88", "srf"=>"3", "cjrq"=>"2013-02-19", "ggrq"=>"2013-02-13", "kjjzmj"=>"132", "tze"=>"1111", "dkbz"=>"b", "dkbh"=>"8", "qdhtrq"=>"2013-02-12", "gdfs"=>"国有租赁", "ydkgsj"=>"2013-02-11", "sjjkrq"=>"2013-02-27", "ydjkrq"=>"2013-02-21", "cyml"=>"", "rjl"=>"1.5", "zczb"=>"fd", "cr"=>"11", "cjzj"=>"1111", "dj_mwj"=>"0.733", "pgj"=>"11", "dkxz"=>"x", "cx"=>"城区"}
  def save_ydb
    if params['ydb_id']=="" 
      user = User.find_by_sql("insert into ydb (cx, gdfs, crfapzrq, ggrq, cjrq, qdhtrq, gdrq, cjqrsbh, htbh, pfwh, crf, srf, lxr, dh, jsxmmc, dkwz, dkbh, zdmj, dkdz, dkxz, dknz, dkbz, pgj, dj_dj, dj_mwj, dj_lmj, cjj_mwj, cjj_lmj, cjzj, yjl, cr, yt, cyml, qsly, tztx, bzj, ydjkrq, sjjkrq, znjqk, qkje, wdqk, cjqk, ydjdsj, sjjdsj, ydkgsj, sjkgsj, ydjgsj, sjjgsj, tze, zczb, rjl, jsmd, lhl, qtyq, kjjzmj, zxtxbl, zxtxmj, bz) values ('#{params['cx']}','#{params['gdfs']}',TIMESTAMP '#{params['crfapzrq']}', TIMESTAMP '#{params['ggrq']}', TIMESTAMP '#{params['cjrq']}', TIMESTAMP '#{params['qdhtrq']}', TIMESTAMP '#{params['gdrq']}','#{params['cjqrsbh']}','#{params['htbh']}','#{params['pfwh']}','#{params['crf']}','#{params['srf']}','#{params['lxr']}','#{params['dh']}','#{params['jsxmmc']}','#{params['dkwz']}','#{params['dkbh']}','#{params['zdmj']}','#{params['dkdz']}','#{params['dkxz']}','#{params['dknz']}','#{params['dkbz']}','#{params['pgj']}','#{params['dj_dj']}','#{params['dj_mwj']}','#{params['dj_lmj']}','#{params['cjj_mwj']}','#{params['cjj_lmj']}','#{params['cjzj']}','#{params['yjl']}','#{params['cr']}','#{params['yt']}','#{params['cyml']}','#{params['qsly']}','#{params['tztx']}','#{params['bzj']}',TIMESTAMP '#{params['ydjkrq']}',TIMESTAMP '#{params['sjjkrq']}','#{params['znjqk']}','#{params['qkje']}','#{params['wdqk']}','#{params['cjqk']}',TIMESTAMP '#{params['ydjdsj']}', TIMESTAMP '#{params['sjjdsj']}', TIMESTAMP '#{params['ydkgsj']}', TIMESTAMP '#{params['sjkgsj']}', TIMESTAMP '#{params['ydjgsj']}', TIMESTAMP '#{params['sjjgsj']}', '#{params['tze']}','#{params['zczb']}','#{params['rjl']}','#{params['jsmd']}','#{params['lhl']}','#{params['qtyq']}','#{params['kjjzmj']}','#{params['zxtxbl']}','#{params['zxtxmj']}','#{params['bz']}') returning id;")
      ydb_id = user[0]['id']
    else 
      User.find_by_sql("update ydb set cx='#{params['cx']}', gdfs='#{params['gdfs']}',crfapzrq = TIMESTAMP '#{params['crfapzrq']}', ggrq =TIMESTAMP '#{params['ggrq']}', cjrq = TIMESTAMP '#{params['cjrq']}', qdhtrq = TIMESTAMP '#{params['qdhtrq']}', gdrq = TIMESTAMP '#{params['gdrq']}', cjqrsbh = '#{params['cjqrsbh']}', htbh = '#{params['htbh']}', pfwh = '#{params['pfwh']}', crf = '#{params['crf']}', srf = '#{params['srf']}', lxr = '#{params['lxr']}', dh = '#{params['dh']}',jsxmmc = '#{params['jsxmmc']}', dkwz = '#{params['dkwz']}', dkbh = '#{params['dkbh']}', zdmj = '#{params['zdmj']}', dkdz = '#{params['dkdz']}', dkxz = '#{params['dkxz']}', dknz = '#{params['dknz']}', dkbz = '#{params['dkbz']}', pgj='#{params['pgj']}', dj_dj='#{params['dj_dj']}',dj_mwj='#{params['dj_mwj']}',dj_lmj='#{params['dj_lmj']}',cjj_mwj='#{params['cjj_mwj']}',cjj_lmj='#{params['cjj_lmj']}',cjzj='#{params['cjzj']}',yjl='#{params['yjl']}', cr='#{params['cr']}', yt='#{params['yt']}', cyml='#{params['cyml']}', qsly='#{params['qsly']}', tztx='#{params['tztx']}', bzj='#{params['bzj']}', ydjkrq=TIMESTAMP '#{params['ydjkrq']}', sjjkrq = TIMESTAMP '#{params['sjjkrq']}', znjqk='#{params['znjqk']}', qkje='#{params['qkje']}',wdqk='#{params['wdqk']}',cjqk='#{params['cjqk']}',ydjdsj=TIMESTAMP '#{params['ydjdsj']}',sjjdsj = TIMESTAMP '#{params['sjjdsj']}', ydkgsj=TIMESTAMP '#{params['ydkgsj']}', sjkgsj=TIMESTAMP '#{params['sjkgsj']}', ydjgsj=TIMESTAMP '#{params['ydjgsj']}', sjjgsj=TIMESTAMP '#{params['sjjgsj']}', tze='#{params['tze']}',zczb='#{params['zczb']}',rjl='#{params['rjl']}',jsmd='#{params['jsmd']}',lhl='#{params['lhl']}',qtyq='#{params['qtyq']}', kjjzmj= '#{params['kjjzmj']}',zxtxbl='#{params['zxtxbl']}',zxtxmj='#{params['zxtxmj']}',bz='#{params['bz']}'   where id = #{params['ydb_id']};")
      ydb_id = params['ydb_id'].to_i
    end    
    render :text => "#{ydb_id}"
  end  
  
  def ydb
    @ydb = User.find_by_sql("select id, jsxmmc, srf, zdmj, yt from ydb limit 10;")
  end
  
  def add_ydb
    render :template => "/map/ydb_add.html.erb"
  end  
  
  def show_ydb
    @ydb = User.find_by_sql("select * from ydb where id = #{params['id']};")[0]
    render :template => "/map/ydb_show.html.erb"
  end
  
  def edit_ydb
    @ydb = User.find_by_sql("select * from ydb where id = #{params['id']};")[0]
    render :template => "/map/ydb_edit.html.erb"
  end  
  
  def more_ydb
    #params['offset'] = 0
    if params['search'] != ''
      @ydb = User.find_by_sql("select id, jsxmmc, srf, zdmj, yt from ydb where jsxmmc like '%#{params['search']}%' offset #{params['offset']} limit 10 ;")
    else                                                                 
      @ydb = User.find_by_sql("select id, jsxmmc, srf, zdmj, yt from ydb offset #{params['offset']} limit 10 ;")
    end    
    txt = ''
    for k in 0..@ydb.size-1
      ydb = @ydb[k]
      txt = txt + "<li><a href=\"/map/show_ydb?id=#{ydb.id}\"><img src=\"/tut/img/#{ydb.yt}.png\" /><h3>#{ydb.jsxmmc}</h3><p>土地面积:#{ydb.zdmj}平米</p><p>受让方:#{ydb.srf}</p></a></li>"
    end
    render :text => txt
  end
  
  def measure
  end  
  
  def xmdk_feature
    @xmdks = User.find_by_sql("select gid,xmmc, pzwh, yddw, tdzl, astext(centroid(transform(the_geom,900913))) from xmdks limit 100;")
    
    if @xmdks.size > 0
      txt = '{"type": "FeatureCollection","features": ['
      for k in 0..@xmdks.size - 1 
        @xmdk = @xmdks[k]
        lonlat = /(\d+.\d+) (\d+.\d+)/.match(@xmdk.astext)
        dd =  "{ \"type\": \"Feature\", \"geometry\": {\"type\": \"Point\", \"coordinates\": [#{lonlat[1]}, #{lonlat[2]}]},\"properties\": {\"gid\": \"#{@xmdk.gid}\", \"项目名称\":\"#{@xmdk.xmmc}\", \"用地单位\":\"#{@xmdk.yddw}\",  \"土地坐落\":\"#{@xmdk.tdzl}\", \"批准文号\":\"#{@xmdk.pzwh}\"}}"
        txt = txt + dd + ','
      end  
      txt = txt[0..-2] + ']}'
    else 
      txt = "{}"
    end
    render :text => txt
  end
  
  #device, task_id
  def addInspect
    @task_id = params['task_id']
    @xmdks = User.find_by_sql("select gid, xmmc, ST_distance(transform(users.the_points,2364), the_geom) as dist from xmdks,users where users.iphone = '#{params['device']}' and gdqkid is not null order by dist limit 10;")
    render :template => '/map/inspect_add.html.erb'
  end
  
  def modifyInspect
    @task_id = params['task_id']
    @xmdk = User.find_by_sql("select * from inspects where plan_id = #{params['task_id']} and xmdk_id = #{params['xmdk_id']};")[0]
    xmdk_id = @xmdk.id
    gdqkid = User.find_by_sql("select gdqkid from xmdks where gid = #{xmdk_id};")[0].gdqkid
    @dksx = User.find_by_sql("select * from dksxxs where gdqkid = '#{gdqkid}';")[0]
    render :template => '/map/inspect_edit.html.erb'
  end
  
  def showInspect
    @task_id = params['task_id']
    @xmdk = User.find_by_sql("select * from inspects where plan_id = #{params['task_id']} and xmdk_id = #{params['xmdk_id']};")[0]
    gdqkid = User.find_by_sql("select gdqkid from xmdks where gid = #{params['xmdk_id']};")[0].gdqkid
    @dksx = User.find_by_sql("select * from dksxxs where gdqkid = '#{gdqkid}';")[0]
    render :template => '/map/inspect_show.html.erb'
  end
  
  #{"sfwf"=>"是", "gdmj"=>"", "xmdk_id"=>"362", "sjzdmj"=>"", "bz"=>"", "task_id"=>"117", "clyj"=>"", "jszt"=>"在建", "wfmj"=>""}
  def add_new_inspect
    user = User.find_by_sql("select count(*) from inspects where plan_id=#{params['task_id']} and xmdk_id=#{params['xmdk_id']};")
    
    if user[0].count.to_i == 0
      User.find_by_sql("insert into inspects (plan_id, xmdk_id, jszt, sfwf, sjzdmj, gdmj, wfmj, clyj, bz, xcrq) values (#{params['task_id']}, #{params['xmdk_id']}, '#{params['jszt']}', '#{params['sfwf']}', '#{params['sjzdmj']}', '#{params['gdmj']}', '#{params['wfmj']}', '#{params['clyj']}',  '#{params['bz']}', '#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}');")
      render :text => "保存成功"
    else
      User.find_by_sql("update inspects set jszt='#{params['jszt']}', sfwf='#{params['sfwf']}', sjzdmj= '#{params['sjzdmj']}', gdmj = '#{params['gdmj']}', wfmj='#{params['wfmj']}', clyj='#{params['clyj']}',  bz='#{params['bz']}', xcrq='#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}' where plan_id=#{params['task_id']} and xmdk_id=#{params['xmdk_id']};")
      render :text => '已经添加'
    end    
  end
  
  def save_old_inspect
    User.find_by_sql("update inspects set jszt='#{params['jszt']}', sfwf='#{params['sfwf']}', sjzdmj= '#{params['sjzdmj']}', gdmj = '#{params['gdmj']}', wfmj='#{params['wfmj']}', clyj='#{params['clyj']}',  bz='#{params['bz']}', xcrq='#{Time.now.strftime('%Y-%m-%d %H:%m:%S')}' where plan_id=#{params['task_id']} and xmdk_id=#{params['xmdk_id']};")
    render :text => "修改成功"
  end  
  
  def getxmdk_wx
    xmmc = params['xmmc']
    @xmdk  = User.find_by_sql("select * from xmdks where xmmc = '#{params['xmmc']}';")[0]
    @dksx = User.find_by_sql("select * from dksxxs where gdqkid = '#{@xmdk.gdqkid}';")[0]
    render :template => '/map/xmdk_show.html.erb'
  end  
end
