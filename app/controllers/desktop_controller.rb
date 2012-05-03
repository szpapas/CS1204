# encoding: utf-8
require 'socket'
require 'find'
require 'date'

class DesktopController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!, :except => [:upload_images, :get_plan_json, :get_inspect_json, :get_2dinfo, :batch_report_pos, :report_task_state, :new_xmdk, :get_task_position]
  before_filter :set_current_user
  
  def index
  end
  
  def get_user_bm
    bm=params['bm']
    mc=params['mc']
    
    sql_str = 'select id, username, bm from users'
    if mc.length > 0 
      sql_str = "#{sql_str} where (username like '#{mc}%' or uname like '#{mc}%') "
    end
    
    if bm.length > 0 && bm != '全部'
      if !sql_str.include?('where')
        sql_str = "#{sql_str} where dw = '#{bm}'" 
      else
        sql_str = "#{sql_str} and dw = '#{bm}'"
      end    
    end
    
    user = User.find_by_sql("#{sql_str} order by username;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  
  def get_xmdk
    search=params['search']
    
    sql_str = 'select gid, xh, sfjs, the_center, xzqmc from xmdk'
    if search.length > 0 && search != '全部'
      sql_str = "#{sql_str} where xzqmc like '#{search}%'"
    end
    
    user = User.find_by_sql("#{sql_str} order by gid;")
    size = user.size;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  
  def get_xzq_center
    xcqy = params['xcqy']
    xcqy = xcqy.split('(')[0]
    user = User.find_by_sql("select the_center from zjzj where xzqmc='#{xcqy}';")
    txt = ''
    if user.size > 0
      txt = user[0].the_center
    end
    render :text => txt  
  end
  
  #Parameters: {"xclx"=>"", "zrq"=>"2012-04-11", "clyj"=>"", "xcnr"=>"", "qrq"=>"2012-04-11", "id"=>"2", "xcdk"=>"", "xcry"=>"陈建刚,陈进,沈洁,沈建根,仇\345\217\266", "xcqy"=>"古里镇(2)", "xcjg"=>""}
  def add_plan
    id = params['id']
    qrq, zrq = params['qrq'], params['zrq']
    session_id=Time.now.to_i.to_s
    xcbh = "XC#{session_id}"
    if id.nil? || id == ''
      User.find_by_sql("insert into plans (xcbh, xcqy, xclx, xcry, xcfs, xmdk, qrq, zrq, zt, session_id) values('#{xcbh}', '#{params['xcqy']}', '#{params['xclx']}' , '#{params['xcry']}', '#{params['xcfs']}', '#{params['xmdk']}', TIMESTAMP '#{qrq}', TIMESTAMP '#{zrq}', '计划', '#{session_id}');")
    else
      User.find_by_sql("update plans set xcbh='#{xcbh}', xcqy= '#{params['xcqy']}', xclx = '#{params['xclx']}', xcry='#{params['xcry']}', xcfs='#{params['xcfs']}', xcnr='#{params['xcnr']}', xmdk='#{params['xmdk']}', qrq=TIMESTAMP '#{qrq}', zrq=TIMESTAMP '#{zrq}', xcjg= '#{params['xcjg']}', clyj='#{params['clyj']}' where id = #{params['id']};")
    end
    
    render :text => 'Success'
  end
  
  def delete_selected_plan
    User.find_by_sql("delete from plans where id in (#{params['id']});")
    User.find_by_sql("delete from inspects where plan_id in (#{params['id']});") 
    render :text => 'Success'
  end  
  
  
  def get_plan
    params['start'] = params['start'] || "0"
    params['limit'] = params['limit'] || "25"
    params['xcqy']  = params['xcqy'] || "全部"
    params['xcfs']  = params['xcfs'] || "全部"
    params['zt']    = params['zt'] || "全部"
    
    cond=[]
    cond << "zt='#{params['zt']}'" if params['zt'] != '全部'
    cond << "xcqy='#{params['xcqy']}'" if params['xcqy'] != '全部'
    cond << "xcfs='#{params['xcfs']}'" if params['xcfs'] != '全部'
    
    case cond.size
    when 0
        conds = ''
    when 1
        conds = "where #{cond[0]}"
    else
        conds = "where #{cond.join(' and ')}"
    end
    
    user = User.find_by_sql("select count(*) from plans #{conds} ;")[0]
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      puts "select * from plans #{conds} limit #{params['limit']} offset #{params['start']};"
      user = User.find_by_sql("select * from plans #{conds} limit #{params['limit']} offset #{params['start']};")
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_plan_json
    username = params['username'] || ""
    if username == ""
      txt = ""
    else  
      plan = User.find_by_sql("select id, xcbh, session_id,xcqy,xcfs,xcry,qrq,zrq,zt from plans where xcry like '%#{username}%';")
      txt = plan.to_json
    end
    render :text  => txt
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
	
	
  
  def get_user
    render :text => User.current.to_json
  end
  
  def print_selected_plan
    user = User.find_by_sql("select * from plans where id in (#{params['id']});")
    for k in 0..user.size-1
      system("ruby ./dady/bin/print_plan.rb #{user[k].id}")
    end
    render :text => 'Success'
  end
  
  #?lat=31.722044&lon=120.584175
  def get_2dinfo
    lon, lat = params['lon'], params['lat']
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

    render :text => txt  
  end
  
  
  def batch_report_pos
    data = params["data"]
    session_id = params["session_id"]
    lines = data.split("\n");
    k = lines.count-1
    while k >= 0
      ss = lines[k].split(',');
      lon_lat=User.find_by_sql("select astext(transform(geomFromText('Point(#{ss[1]} #{ss[2]})',4326),900913));")[0].astext.gsub('POINT(','').gsub(')','')
      User.find_by_sql("insert into location_points(session_id, lon_lat, report_time ) values ('#{session_id}','#{lon_lat}','#{ss[3]}');")  
      k = k-1;
    end
    
    user=User.find_by_sql("select lon_lat, report_time from location_points where session_id='#{session_id}' order by id desc limit 1;")
    
    if user.size > 0
      User.find_by_sql("update plans set the_points=geomFromText('Point(#{user[0].lon_lat})',900913), report_at= TIMESTAMP '#{user[0].report_time}' where session_id='#{session_id}';")
    end
    
    render :text => 'Success'
  end
  
  
  def report_task_state
    state = params["state"]
    
    if state=="on"
      #task_id, device_no, username
      time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
      session_id = params['session_id']
      
      plan = User.find_by_sql("select id, session_id, icon from plans where session_id='#{session_id}';")
      
      User.find_by_sql("update plan set username='#{params['username']}', device='#{params['device']}', taskbegintime=TIMESTAMP '#{time}' zt='执行' where session_id ='#{session_id}';")

      User.find_by_sql("update plans set taskbegintime='#{time}' where session_id = '#{session_id}';")
      User.find_by_sql("update plans set zt='执行' where session_id = '#{session_id}';")
      render :text => "Success:#{session_id}"
    elsif state=="off"
      session_id=params["session_id"]
      time = Time.now.strftime("%Y-%m-%d %H:%M:%S")
      
      #这个地方是Multiple-Line, 先忽略过去
      #generate geometry
      #user = User.find_by_sql("select lon_lat from location_points where session_id='#{session_id}' order by id;")    
      #points=[]
      #for k in 0..user.size-1 
      #  points[k]=user[k].lon_lat
      #end
      #geomtext = "geomFromText('LINESTRING(#{points.join(',')})',900913)"
      
      User.find_by_sql("update plans set taskendtime=TIMESTAMP '#{time}',  zt='完成' where session_id='#{session_id}';")
      render :text => 'Success'  
    else
      render :text => 'Failure:unknown state'      
    end  

    render :text => 'Successs'
  end
  
  def get_ygtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct bm from users order by bm;")
      data.each do |dd|
        text << {:text => dd["bm"], :id => dd["bm"], :cls  => "folder"}
      end
    else
      pars = node.split('|') || []
  
      if pars.length == 1
        data = User.find_by_sql("select distinct username, bgdh, iphone from users where bm=\'#{pars[0]}\';")
        data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
      end
    end
    render :text => text.to_json
  end
  
  
  #add at 04/29
  
  def get_xcry(xcqy)
    user = User.find_by_sql("select username from users where dw='#{xcqy}' limit 10;")
    txt = ''
    for k in 0..user.count-1
      txt=txt + ','+user[k].username
    end
    txt = txt[1..-1] if txt.size > 0
  end

  def get_xzq_xcry
    txt = get_xcry(params['xcqy'])
    render :text => txt
  end 
  
  def get_week_day
    year, week_num = params['nd'].to_i, params['week'].to_i
    #year = Time.now.year if year.nil?
    week_start = Date.commercial(year, week_num, 1 )
    week_end = Date.commercial(year, week_num, 7 )
    txt = week_start.strftime( "%Y-%m-%d" ) + '|' + week_end.strftime( "%Y-%m-%d" )
    puts txt
    render :text => txt
  end
  
  
  def add_zhxc_single(xcqy, nd, pd)
    data = User.find_by_sql("select distinct dw, dwjc from users where dw='#{xcqy}';")
    xcry = get_xcry(xcqy)
    case pd
    when '2周1次'
      for week in 1..26
        week_start = Date.commercial(nd, week*2-1, 1)
        week_end   = Date.commercial(nd, week*2, 7 )
        xcbh = "xc-#{data[0].dwjc}-bw#{week.to_s.rjust(2,'0')}"
        session_id =rand(36**32).to_s(36)
        qrq = week_start.strftime( "%Y-%m-%d" ) 
        zrq = week_end.strftime( "%Y-%m-%d" )
        User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')" 
      end  
    when '1周1次'
      for week in 1..52
        week_start = Date.commercial(nd, week, 1)
        week_end   = Date.commercial(nd, week, 7 )
        xcbh = "xc-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}"
        session_id =rand(36**32).to_s(36)
        qrq = week_start.strftime( "%Y-%m-%d" ) 
        zrq = week_end.strftime( "%Y-%m-%d" )
        User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')" 

      end
    when '1月1次'
      for month in 1..12
        week_start = Date.new(nd,month,1)
        week_end   = Date.new(nd,month,-1)
        xcbh = "xc-#{data[0].dwjc}-m#{month.to_s.rjust(2,'0')}"
        session_id =rand(36**32).to_s(36)
        qrq = week_start.strftime( "%Y-%m-%d" ) 
        zrq = week_end.strftime( "%Y-%m-%d" )
        User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')" 
      end          
    end
  end
  
  def add_zhxc(xqzmc, nd, pd)
    if xqzmc=='全部'
      user = User.find_by_sql("select distinct dw from users where dw is not null;")
      for k in 0..user.count-1
        xcqy = user[k].dw
        add_zhxc_single(xcqy, nd, pd)
      end  
    else 
      add_zhxc_single(xqzmc, nd, pd)
    end  
  end
  
  def add_ddxc(nd)
    user = User.find_by_sql("select gid, xh, xzqmc from xmdk where nd='#{nd}' order by xh;")
    for k in 0..user.count-1
      data = user[k]
      puts data.to_json, data.xh
      xcbh = "#{data.xh}-#{nd}"
      xcqy = data.xzqmc
      xcry = get_xcry(data.xzqmc)
      session_id =rand(36**32).to_s(36)
      qrq = "#{nd}-01-01" 
      zrq = "#{nd}-12-31"
      User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry, xmdk) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '定点巡查', '#{xcry}', '#{data.xh}')"
      cvl = User.find_by_sql "SELECT id from plans where session_id = '#{session_id}'"
      plan_id = cvl[0].id.to_i
      User.find_by_sql "insert into inspects (plan_id, xmdk_id) values (#{plan_id}, #{data.gid});"
    end 
  end
  
  def add_plan_wiz
    xcfs,xcqy,nd,pd = params['xcfs'],params['xcqy'],params['nd'].to_i,params['pd']
    if xcfs=='综合巡查'
      add_zhxc(xcqy, nd, pd)
    else
      add_ddxc(nd)
    end
      
    render :text => 'Success'
  end

  #====add at 05/02
	def new_xmdk
	  if params['xmdk_id'] == '-1'
	    geom_str = "transform(geomFromText('#{params['the_geom']}', 4326), 900913)"
	    User.find_by_sql("insert into xmdk (xh, the_geom) values ('#{params['xmmc']}', #{geom_str})")
	    user = User.find_by_sql("select max(gid) from xmdk;")
	    xmdk_id = user[0].max.to_i
      User.find_by_sql("insert into inspects (plan_id, xmdk_id) values (#{params['plan_id']}, #{xmdk_id})")
	    user = User.find_by_sql("select max(id) from inspects;")
	    inspect_id = user[0].max.to_i
	    user = User.find_by_sql("select astext(transform(centroid(the_geom), 4326)) from xmdk where gid = #{xmdk_id}")
	    center = user[0].astext[6,33]
      render :text => "[{\"users\":{\"xmdk_id\":\"#{xmdk_id}\",\"inspect_id\":\"#{inspect_id}\", \"center\":\"#{center}\"}}]"
	  else
	    render :text => ''
	  end  
	end
  
  # get all current_active user postion, 当前Area内的。
  def get_task_position
    txt = '[{"users":{"lon_lat":"13433188 3715760","id":32,"icon":"bee.png","username":"高飞","color":"#800000"}}]'
    render :text=> txt  
  end
  
  #==================
  def get_mulu
    user = User.find_by_sql("select * from mulu order by id;")
    size = user.size;
    if size > 0
      txt = "{results:#{size},rows:["
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_tree
    text = []
    node, style = params["node"], params['style']
   
    if node == "root"
      data = User.find_by_sql("select distinct qzh, dwjc from archive inner join d_dwdm on d_dwdm.id=cast(qzh as integer) order by qzh;")
      data.each do |dd|
        text << {:text => "#{dd['qzh']} #{dd['dwjc']}", :id => dd["qzh"], :cls => "folder"}
      end
    else
      pars = node.split('|') || []
      
      if style.to_i == 1
        data = User.find_by_sql("select distinct cast(archive.mlh as integer), archive.dalb, mlm from archive inner join q_qzxx on cast (archive.mlh as integer) = q_qzxx.mlh  where archive.qzh='#{pars[0]}' order by mlh;")
        data.each do |dd|
            text << {:text => "目录 #{dd['mlm']}", :id => node+"|#{dd["dalb"]}|#{dd["mlh"]}", :leaf => true, :cls => "file"}
        end
      else
        if pars.length == 1
          data = User.find_by_sql("select distinct cast(dalb as integer), lbmc from archive inner join d_dalb on cast(dalb as integer)=d_dalb.id where qzh='#{pars[0]}' order by dalb;")
          data.each do |dd|
            text << {:text => "#{dd['dalb']} #{dd['lbmc']}", :id => node+"|#{dd["dalb"]}", :cls => "folder"}
          end
        end
        if pars.length == 2
          #data = User.find_by_sql("select distinct cast(mlh as integer) from archive where qzh='#{pars[0]}' and dalb='#{pars[1]}' order by mlh;")
          data = User.find_by_sql("select distinct cast(archive.mlh as integer), archive.dalb, mlm from archive inner join q_qzxx on cast (archive.mlh as integer) = q_qzxx.mlh  where archive.qzh='#{pars[0]}' and archive.dalb='#{pars[1]}' order by mlh;")
          data.each do |dd|
              text << {:text => "目录 #{dd['mlm']}", :id => node+"|#{dd["mlh"]}", :leaf => true, :cls => "file"}
          end
        end
      end
    end

    render :text => text.to_json
  end
    
  def split_string(text, length=16)
    char_array = text.unpack("U*")
    if char_array.size > length
      t1 = char_array[0..length-1].pack("U*")
      t2 = char_array[length..-1].pack("U*")
      return "#{t1}\n#{split_string(t2, length)}"
    else
      return text
    end
  end
   
  def get_d_dwdm
    user = User.find_by_sql("select count(*) from d_dwdm;")
    size = user[0].count;
    if size.to_i > 0
        txt = "{results:#{size},rows:["
        user = User.find_by_sql("select id, id || ' ' || dwdm as dwdm from d_dwdm order by id;")
        size = user.size;
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  def get_d_dwdm_n
    user = User.find_by_sql("select count(*) from d_dwdm;")
    size = user[0].count;
    if size.to_i > 0
        txt = "{rows:["
        user = User.find_by_sql("select id, id || ' ' || dwdm as dwdm from d_dwdm order by id;")
        size = user.size;
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{rows:[]}"
    end
    render :text => txt
  end

  def upload_file
    params.each do |k,v|
      logger.debug("K: #{k} ,V: #{v}")
      if k.include?("ext")
        logger.debug("#{v.original_filename}")
        logger.debug("#{v.tempfile.path}")
        logger.debug("#{v.content_type}")
        ff = File.new("./dady/#{v.original_filename}","w+")
        ff.write(v.tempfile.read)
        ff.close
        break
      end
    end
    render :text => "{success:true}"
  end

  def decode_file (f)
    system("iconv -t UTF-8 -f GB18030 #{f} > newfile")
    ss = File.open("newfile").read
    x= ActiveSupport::JSON.encode(ss).gsub(/\\n/, '').gsub("'","\"").gsub(/\\r/,'')
    ff = File.open("./dady/decoded","w+")
    ff.write(x[1..-2])
    ff.close
    system("rm newfile")
  end
  
  def update_owner
    User.find_by_sql("update a_dzda set ownerid=archive.id from archive where archive.dh=a_dzda.dh;")
    User.find_by_sql("update a_jhcw set ownerid=archive.id from archive where archive.dh=a_jhcw.dh;")
    User.find_by_sql("update a_jjda set ownerid=archive.id from archive where archive.dh=a_jjda.dh;")
    User.find_by_sql("update a_sbda set ownerid=archive.id from archive where archive.dh=a_sbda.dh;")
    User.find_by_sql("update a_swda set ownerid=archive.id from archive where archive.dh=a_swda.dh;")
    User.find_by_sql("update a_tddj set ownerid=archive.id from archive where archive.dh=a_tddj.dh;")
    User.find_by_sql("update a_tjda set ownerid=archive.id from archive where archive.dh=a_tjda.dh;")
    User.find_by_sql("update a_wsda set ownerid=archive.id from archive where archive.dh=a_wsda.dh;")
    User.find_by_sql("update document set ownerid=archive.id from archive where document.dh=archive.dh;")
  end

  def upload_images
    params.each do |k,v|
      logger.debug("K: #{k} ,V: #{v}")
    end
    render :text => "success"
  end
  
  #查询卷内目录
  def get_archive_where
    if (params['query'].nil?)
      txt = "{results:0,rows:[]}"
    else
      user = User.find_by_sql("select count(*) from archive where tm like '%#{params['query']}%';")[0]
      size = user.count.to_i;
      if size > 0
        txt = "{results:#{size},rows:["
        user = User.find_by_sql("select * from archive where tm like '%#{params['query']}%' limit #{params['limit']} offset #{params['start']};")
        for k in 0..user.size-1
          txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
      else
        txt = "{results:0,rows:[]}"
      end
    end
    render :text => txt
  end

  #查询卷内目录
  def get_document_where
    if (params['query'].nil?)
      txt = "{results:0,rows:[]}"
    else
      user = User.find_by_sql("select * from document where tm like '%#{params['query']}%' limit #{params['limit']};")
      size = user.size;
      if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
          txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
      else
        txt = "{results:0,rows:[]}"
      end
    end
    render :text => txt
  end

  def set_documents(tt, qzh, dalb)
    for k in 0..tt.size-1
      user = tt[k]['Table']
      #dalb = user['档案类别'].to_i

      tm = user['题名']
      mlh = user['目录号']
      ajh = user['案卷号'].rjust(4,"0")
      sxh = user['顺序号']
      yh = user['页号']
      wh = user['文号']
      zrz = user['责任者']
      rq = user['日期']
      bz = user['备注']
      dh = "#{qzh}_#{mlh}_#{ajh.to_i}_#{dalb}"

      if rq.length==0
        rq = 'null'
      elsif rq.length==4
        rq = "TIMESTAMP '#{rq}0101'"
      elsif rq.length==6
        rq = "TIMESTAMP '#{rq}01'"
      else
        rq = "TIMESTAMP '#{rq}'"
      end

      insert_str = " INSERT INTO document(dh,tm,sxh,yh,wh,zrz,rq,bz) VALUES ('#{dh}','#{tm}','#{sxh}','#{yh}','#{wh}','#{zrz}',#{rq},'#{bz}');"
      logger.debug insert_str
      User.find_by_sql(insert_str)
      
      case dalb
      when 0 #综合档案
      when 2 #财务档案
      when 3 #土地登记
      when 4 #地籍管理
      when 10 #用地档案
      when 14 #监查案件
      when 15 #Image
      when 17 #土地规划
      when 19 #科技信息
      when 20 #Image
      when 21 #地址矿产
      when 24 #文书档案
      else
        #puts "#{dalb}"
      end

    end

  end

  def set_archive(tt, dwdm, qzh, dalb)
    for k in 0..tt.size-1
      user = tt[k]['Table']
      #dalb = user['档案类别'].to_i

      mlh = user['目录号']
      ajh = user['案卷号'].rjust(4,"0")
      tm = user['案卷标题']
      flh = user['分类号']
      nd = user['年度']
      zny = user['止年月']
      qny = user['起年月']
      js = user['件数'].to_i
      ys = user['页数'].to_i
      bgqx = user['保管期限']
      mj = user['密级']
      xh = user['箱号']
      cfwz = user['存放位置']
      bz = user['备注']
      boxstr = user['boxstr']
      rfidstr = user['标签ID']
      boxrfid = user['盒标签']
      qrq = user['起日期']
      zrq = user['止日期']

      tm = user['案卷题名'] if tm.nil?
      dh = "#{qzh}_#{dalb}_#{mlh}_#{ajh.to_i}"

      if qrq.nil?
        if qny == ''
          logger.debug('=======qny is null=====')
          qrq = "#{nd}-01-01"
          zrq = "#{nd}-12-31"
          qny = "#{nd}01"
          zny = "#{nd}12"
        else
          qyy,qmm = qny[0..3], qny[4..5]
          if qmm.to_i == 0
            qmm = '01'
            qny = qyy+'01'
          end
          if qmm.to_i>12
            qmm = '12'
            qny = qyy+'12'
          end
          qrq = "#{qyy}-#{qmm}-01"

          zyy = zny[0..3]
          zmm = zny[4..5]
          if zmm.to_i ==0
            zmm = '01'
            zny = zyy + '01'
          end
          if zmm.to_i>=12
            t1 = Time.mktime(zyy, 12, 31)
            zny = zyy+'12'
          else
            t1 = Time.mktime(zyy, (zmm.to_i+1).to_s)-86400
          end
          zrq = t1.strftime("%Y-%m-%d")
        end
      else
        if qrq.size == 6
          qyy,qmm,qdd = qrq[0..3], qrq[4..5],qrq[6..7]
          zyy,zmm,zdd = zrq[0..3], zrq[4..5],zrq[6..7]

          qrq = "#{qyy}-#{qmm}-#{qdd}"
          zrq = "#{zyy}-#{zmm}-#{zdd}"

          qny = "#{qyy}#{qmm}"
          zny = "#{zyy}#{zmm}"
        end

      end

      insert_str = " INSERT INTO archive(dh,dwdm,qzh,mlh,ajh,tm,flh,nd,zny,qny,js,ys,bgqx,mj,xh,cfwz,bz,boxstr,rfidstr,boxrfid,qrq,zrq,dalb) VALUES ('#{dh}','#{dwdm}','#{qzh}','#{mlh}','#{ajh}','#{tm}','#{flh}','#{nd}','#{zny}','#{qny}',#{js},#{ys},'#{bgqx}','#{mj}','#{xh}','#{cfwz}','#{bz}','#{boxstr}','#{rfidstr}','#{boxrfid}', TIMESTAMP '#{qrq}', TIMESTAMP '#{zrq}', '#{dalb}');"
      
      logger.debug insert_str
      User.find_by_sql(insert_str)
      
      case dalb
      when 0 #综合档案
      when 2 #财务档案
        jnzs = user['卷内张数']
        pzqh = user['凭证起号']
        pzzh = user['凭证止号']
        fjzs = user['附件编号']

        insert_str = " INSERT INTO a_jhcw(dh,jnzs,pzqh,pzzh,fjzs) VALUES ('#{dh}','#{jnzs}','#{pzqh}','#{pzzh}','#{fjzs}');"
        logger.debug insert_str
        User.find_by_sql(insert_str)
        
      when 3 #土地登记
        djh = user['地籍号']
        qlrmc = user['权利人名称']
        tdzl = user['土地座落']
        qsxz = user['权属性质']
        ydjh = user['原地籍号']

        insert_str = " INSERT INTO a_tddj(dh,djh,qlrmc,tdzl,qsxz,ydjh) VALUES ('#{dh}','#{djh}','#{qlrmc}','#{tdzl}','#{qsxz}','#{ydjh}');"
        logger.debug insert_str
        User.find_by_sql(insert_str)
        
      when 4 #地籍管理
      when 10 #用地档案
      when 14 #监查案件
      when 15 #Image
      when 17 #土地规划
      when 19 #科技信息
      when 20 #Image
      when 21 #地址矿产
      when 24 #文书档案
      else
        #puts "#{dalb}"
      end
    end
  end
  
  #quh, dwdm, dwjc
  def add_qzh
    user = User.find_by_sql("select count (*) from d_dwdm where id = #{params['qzh']};")[0]
    if user.count.to_i == 0
      User.find_by_sql("insert into d_dwdm(id, dwdm, dwjc) values (#{params['qzh']}, '#{params['dwdm']}', '#{params['dwjc']}');")
      render :text => "{success:true}"
    else
      render :text => "{success:false}"
    end
  end

  def delete_qzh
    user = User.find_by_sql("delete from d_dwdm where id = #{params['qzh']};")
    render :text => 'Success'
  end

  def check_mlh
    user = User.find_by_sql("select id from archive where qzh='#{params['qzh']}' and mlh='#{params['mlh']}' limit 1;")
    render :text => user.to_json
  end
  
  def get_print_status
    qzh, mlh, dalb = params['qzh'], params['mlh'], params['dalb']
    dydh = "#{qzh}-#{dalb}-#{mlh}"
    user = User.find_by_sql("select * from p_status where dydh = '#{dydh}';")
    if user.size > 0
      data = user[0];
      render :text => "#{data.dqjh}|#{data.qajh}|#{data.zajh}|#{data.dyzt}"
    else
      render :text => "1|1|100|打印完成"
    end
  end
  
  def print_wizard
    qzh, mlh, dalb, qajh, zajh = params['qzh'], params['mlh'], params['dalb'], params['qajh'], params['zajh']
    
    dylb = 0
    dylb += 8 if !params['dylb-1'].nil?
    dylb += 4 if !params['dylb-2'].nil?
    dylb += 2 if !params['dylb-3'].nil?
    dylb += 1 if !params['dylb-4'].nil?

    logger.debug "ruby ./dady/bin/print_wizard.rb #{qzh} #{mlh} #{dalb} #{qajh} #{zajh} #{dylb} 1 &"

    dydh = "#{qzh}-#{dalb}-#{mlh}"
    User.find_by_sql("delete from p_status where dydh='#{dydh}';")
    User.find_by_sql("insert into p_status (dydh, mlh, dqjh, qajh, zajh, dyzt) values ('#{dydh}', '#{mlh}', '#{qajh}', '#{qajh}', '#{zajh}', '正在准备打印' );")

    system("ruby ./dady/bin/print_wizard.rb #{qzh} #{mlh} #{dalb} #{qajh} #{zajh} #{dylb} 1 &")
    render :text => "Success"
  end

  def export_image
    user = User.find_by_sql("select qzh, mlh, dalb from archive where id = #{params['id']}");
    
    data = user[0]
    dh = "#{data.qzh}-#{data.dalb}-#{data.mlh}-%"
    imgs = User.find_by_sql("select id, dh from timage where dh like '#{dh}' order by id;")
    
    outPath = "./dady/#{data.mlh}"
    if File.exists?(outPath)
      system "rm -rf #{outPath}"
    end
    system "mkdir -p #{outPath}"
    
    
    for k in 0..imgs.size - 1 do
      dd = imgs[k]
      user = User.find_by_sql("select * from timage where id='#{dd.id}';")
      ss = user[0]["data"] #already escaped
      local_filename = "#{outPath}/"+user[0]["yxmc"]
      File.open(local_filename, 'w') {|f| f.write(ss) }
    end
    
    logger.debug "zip #{outPath}.zip #{outPath}/*"
    system "zip -0 #{outPath}.zip #{outPath}/*"
    render :text => "/assets/dady/#{data.mlh}.zip"
    
  end
  
  #************************************************************************************************
  #
  # get_upload_info
  # input : archive_id
  # output: {dwdm:'溧水县国土资源局', mlh:'1', total_pics:'5279', save_path:'/share/溧水县国土资源局/目录1'}
  #
  #************************************************************************************************
  def get_upload_info
    dd = User.find_by_sql("select qzh, dwdm, dalb, mlh from archive where id = #{params['id']};")[0]
    user = User.find_by_sql("select sum(ys) as zys from archive where qzh = '#{dd.qzh}' and dalb = '#{dd.dalb}' and mlh = '#{dd.mlh}';")
    totalSize = user[0].zys;
    
    if !File.exists?("/share/#{dd.dwdm}/目录#{dd.mlh}")
      puts "mkdir -p '/share/#{dd.dwdm}/目录#{dd.mlh}'"
      system ("mkdir -p '/share/#{dd.dwdm}/目录#{dd.mlh}'")
    end
    
    ip = IPSocket.getaddress(Socket.gethostname)
    render :text => "[{dwdm:'#{dd.dwdm}', mlh:'#{dd.mlh}', total_pics:'#{totalSize}', save_path:'/share/#{dd.dwdm}/目录#{dd.mlh}', map_ip:'#{ip}'}]"
  end
  
  #************************************************************************************************
  #
  # get_upload_status
  # input: yxwz /share/溧水县国土资源局/目录1
  # ztps 5279
  #
  #************************************************************************************************
  def get_upload_status
    copyedFile = Dir["#{params['yxwz']}/*"].size
    render :text => "#{copyedFile}|#{params['ztps']}"
  end
  
  #************************************************************************************************
  #
  # upload_files
  # input: qzh 4
  # dalb 10
  #
  #************************************************************************************************
  def upload_files
    params.each do |k,v|
      logger.debug("K: #{k} ,V: #{v}")
    end
    
    ff = params['ajb'].original_filename
    
    mlh = ''
    ff.each_byte do |b|
      if b < 127
        mlh = mlh + b.chr
      else
        break
      end
    end
    
    qzh = params['qzh']
    dalb = params['dalb']
    
    dh = "#{qzh}-#{dalb}-#{mlh}-%"
    
    #delete any document connected to dh
    User.find_by_sql("delete from archive where dh like '#{dh}'; ")
    User.find_by_sql("delete from document where dh like '#{dh}'; ")

    user = User.find_by_sql("select * from d_dwdm where id=#{qzh};")[0]
    dwdm = user.dwdm # find by sql query

    v = params['jnb']
    ff = File.new("./dady/tmp/#{v.original_filename}","w+")
    ff.write(v.tempfile.read)
    ff.close

    v = params['ajb']
    ff = File.new("./dady/tmp/#{v.original_filename}","w+")
    ff.write(v.tempfile.read)
    ff.close
    
    logger.debug "ruby ./dady/bin/upload_mulu.rb #{v.original_filename} #{dwdm} #{qzh} #{dalb} &"
    system ("ruby ./dady/bin/upload_mulu.rb #{v.original_filename} #{dwdm} #{qzh} #{dalb} &")
    
    render :text => "{success:true}"
  end
  
  #查询借阅流程
  def get_jydjlc_jyzt
    if (params['query'].nil?)
      txt = "{results:0,rows:[]}"
    else
      jyzt=params['query']
      if (jyzt=='')
        txt = "{results:0,rows:[]}"
      else
        user = User.find_by_sql("select count(*) from jylc where jyzt = #{params['query']};")[0]
        size = user.count.to_i;
        if size > 0
          txt = "{results:#{size},rows:["
          user = User.find_by_sql("select * from jylc where jyzt = #{params['query']};")
          for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
          end
          txt = txt[0..-2] + "]}"
        else
          txt = "{results:0,rows:[]}"
        end
      end
    end
    render :text => txt
  end

  #查询借阅流程
  def get_jydjlist
    if (params['id'].nil?)
      txt = "{results:0,rows:[]}"
    else
      ids=params['jyzt']
      if (ids=='')
        txt = "{results:0,rows:[]}"
      else
        if (ids=='2')
          user = User.find_by_sql("select count(*) from archive where id in (select daid from jylist where jyid=#{params['id']} and hdsj IS NULL);")[0]
          size = user.count.to_i;
          
          if size > 0
            txt = "{results:#{size},rows:["
            user = User.find_by_sql("select * from archive where id in (select daid from jylist where jyid=#{params['id']} and hdsj IS NULL);")
            for k in 0..user.size-1
              txt = txt + user[k].to_json + ','
            end
            txt = txt[0..-2] + "]}"
          else
            txt = "{results:0,rows:[]}"
          end
        else
          user = User.find_by_sql("select count(*) from archive where id in (select daid from jylist where jyid=#{params['id']} );")[0]
          size = user.count.to_i;
          if size > 0
            txt = "{results:#{size},rows:["
            user = User.find_by_sql("select * from archive where id in (select daid from jylist where jyid=#{params['id']} );")
            for k in 0..user.size-1
              txt = txt + user[k].to_json + ','
            end
            txt = txt[0..-2] + "]}"
          else
            txt = "{results:0,rows:[]}"
          end
        end
      end
    end
    render :text => txt
  end

  #quh, dwdm, dwjc
  def add_qzh
    user = User.find_by_sql("select count (*) from d_dwdm where id = #{params['qzh']};")[0]
    if user.count.to_i == 0
      User.find_by_sql("insert into d_dwdm(id, dwdm, dwjc) values (#{params['qzh']}, '#{params['dwdm']}', '#{params['dwjc']}');")
      render :text => "{success:true}"
    else
      render :text => "{success:false}"
    end
  end

  def delete_qzh
    user = User.find_by_sql("delete from d_dwdm where id = #{params['qzh']};")
    render :text => 'Success'
  end

  def check_mlh
    user = User.find_by_sql("select id from archive where qzh='#{params['qzh']}' and mlh='#{params['mlh']}' limit 1;")
    render :text => user.to_json
  end
  
  def archive_query_jygl
    cx_tj=''
    
    if !(params['mlh'].nil?)
      cx_tj="archive.mlh='#{params['mlh']}'"
    end
    
    if !(params['ajh'].nil?)

      if (cx_tj!='')
        cx_tj=cx_tj + " and archive.ajh='#{params['ajh']}'"
      else
        cx_tj=" archive.ajh='#{params['ajh']}'"
      end
    end
    
    if !(params['ajtm'].nil?)
      if (cx_tj!='')
        cx_tj=cx_tj + " and archive.tm like '%#{params['ajtm']}%'"
      else
        cx_tj="archive.tm like '%#{params['ajtm']}%'"
      end
    end
    
    jn_cx_tj=''
    if !(params['wh'].nil?)
      jn_cx_tj="wh like '%#{params['wh']}%'"
    end
    if !(params['zrz'].nil?)

      if (jn_cx_tj!='')
        jn_cx_tj=jn_cx_tj + " and zrz like '%#{params['zrz']}%'"
      else
        jn_cx_tj=" zrz like '%#{params['zrz']}%'"
      end
    end
    
    if !(params['tm'].nil?)
      if (jn_cx_tj!='')
        jn_cx_tj=jn_cx_tj + " and document.tm like '%#{params['tm']}%'"
      else
        jn_cx_tj="document.tm like '%#{params['tm']}%'"
      end
    end
    
    dj_cx_tj=''
    if !(params['djh'].nil?)
      dj_cx_tj="djh like '%#{params['djh']}%'"
    end
    
    if !(params['tdzl'].nil?)
      if (dj_cx_tj!='')
        dj_cx_tj=dj_cx_tj + " and tdzl like '%#{params['tdzl']}%'"
      else
        dj_cx_tj=" zrz like '%#{params['tdzl']}%'"
      end
    end
    
    if !(params['qlr'].nil?)
      if (dj_cx_tj!='')
        dj_cx_tj=dj_cx_tj + " and qlrmc like '%#{params['qlr']}%'"
      else
        dj_cx_tj="qlrmc like '%#{params['qlr']}%'"
      end
    end

    jy_select=''
    if (jn_cx_tj!='')
      if (cx_tj!='')
        if (dj_cx_tj!='')
          jy_select="select * from document,archive,a_tddj WHERE a_tddj.ownerid = archive.id AND document.ownerid = archive.id and #{cx_tj} and #{jn_cx_tj} and #{dj_cx_tj}"
        else
          jy_select="select * from document,archive WHERE document.ownerid = archive.id and #{cx_tj} and #{jn_cx_tj} "
        end
      else
        if (dj_cx_tj!='')
          jy_select="select * from document,archive,a_tddj WHERE a_tddj.ownerid = archive.id AND document.ownerid = archive.id and #{jn_cx_tj} and #{dj_cx_tj}"
        else
          jy_select="select * from document,archive WHERE document.ownerid = archive.id and #{jn_cx_tj}"
        end
      end
    else
      if (cx_tj!='')
        if (dj_cx_tj!='')
          jy_select ="select * from archive,a_tddj where a_tddj.ownerid = archive.id AND #{cx_tj} and #{dj_cx_tj}"
        else
          jy_select ="select * from archive where #{cx_tj} "
        end
      else
        if (dj_cx_tj!='')
          jy_select ="select * from archive,a_tddj where a_tddj.ownerid = archive.id and #{dj_cx_tj}"
        else
          jy_select =''
        end
        
      end
    end
    
    if (jy_select!='')
      user = User.find_by_sql(" #{jy_select}")
      size = user.size;
      if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
      else
        txt = "{results:0,rows:[]}"
      end
    else
      txt = "{results:0,rows:[]}"
    end
    render:text=>txt
  end
  
  def insert_jylc
      if !(params['jylx'].nil?)
        jylx=params['jylx']
      end
      if !(params['jytj'].nil?)
        jytj=params['jytj']
      end
      if !(params['lymd'].nil?)
        lymd=params['lymd']
      end
      if !(params['jyqx'].nil?)
        lyqx=params['jyqx']
      else
        lyqx=0
      end
      if (params['fyys']=='')
        fyys=0
      else
        fyys=params['fyys']
      end
      if (params['czrid']=='')
        czrid=0
      else
        czrid=params['czrid']
      end
      if (params['zcys']=='')
        zcys=0
      else
        zcys=params['zcys']
      end
      rq=Time.now.strftime("%Y-%m-%d")
      User.find_by_sql("insert into jylc(jyr, jydw, jylx, zj, lymd, lyxg, jysj, fyys, zcys, jyqx, cdlr, bz, czrid, jyzt, jylist,jytj) values ('#{params['jyr']}', '#{params['jydw']}', '#{jylx}','#{params['zj']}','#{lymd}','#{params['lyxg']}','#{rq}','#{fyys}','#{zcys}','#{lyqx}','#{params['cdlr']}','#{params['bz']}','#{czrid}','#{params['jyzt']}','#{params['jy_aj_list']}','#{jytj}');")
      if !(params['jy_aj_list']=='')
        user = User.find_by_sql("select max(id) as id from jylc;")
        ss = params['jy_aj_list'].split(',')
        for k in 0..ss.length-1
          User.find_by_sql("insert into jylist(jyid, daid) values ('#{user[0]["id"]}', '#{ss[k]}');")
        end
      end
      render :text => "success"
    
  end
  
  def update_jylc
    if !(params['jylx'].nil?)
      jylx=params['jylx']
    end
    if !(params['jytj'].nil?)
      jytj=params['jytj']
    end
    if !(params['lymd'].nil?)
      lymd=params['lymd']
    end
    if !(params['lyqx'].nil?)
      lyqx=params['lyqx']
    else
      lyqx=0
    end
    if (params['fyys']=='')
      fyys=0
    else
      fyys=params['fyys']
    end
    if (params['czrid']=='')
      czrid=0
    else
      czrid=params['czrid']
    end
    if (params['zcys']=='')
      zcys=0
    else
      zcys=params['zcys']
    end
    rq=Time.now.strftime("%Y-%m-%d")
    User.find_by_sql("update jylc set bz='#{params['bz']}', cdlr='#{params['cdlr']}', czrid='#{czrid}', fyys='#{fyys}', jylist='#{params['jy_aj_list']}', jydw='#{params['jydw']}', jylx='#{jylx}', jyqx='#{lyqx}', jyr='#{params['jyr']}', jytj='#{jytj}', jyzt='#{params['jyzt']}', lymd='#{lymd}', lyxg='#{params['lyxg']}', zcys='#{zcys}', zj='#{params['zj']}' where id = #{params['id']};")
    if !(params['jy_aj_list']=='')
      user = User.find_by_sql("select max(id) as id from jylc;")
      ss = params['jy_aj_list'].split(',')
      for k in 0..ss.length-1
        User.find_by_sql("insert into jylist(jyid, daid) values ('#{user[0]["id"]}', '#{ss[k]}');")
      end
    end
    render :text => 'success'
  end
  
  def delete_jylc
    user = User.find_by_sql("delete from jylc where id = #{params['id']};")
    render :text => 'success'
  end
  
  def qbhd_jylc
    rq=Time.now.strftime("%Y-%m-%d")
    user = User.find_by_sql("update jylc set hdsj='#{rq}',jyzt='4' where id = #{params['id']};")
    render :text => 'success'
  end
  
  def xjhd_jylc
    rq=Time.now.strftime("%Y-%m-%d")
    ss = params['ids'].split(',')
    for k in 0..ss.length-1
      User.find_by_sql("update jylist set hdsj ='#{rq}' where daid ='#{ss[k]}' and jyid=#{params['id']};")
    end
    user = User.find_by_sql("select * from jylist where jyid=#{params['id']} and hdsj IS NULL;")

    if user.size==0
      user = User.find_by_sql("update jylc set hdsj='#{rq}',jyzt='4' where id = #{params['id']};")
    end
    #user = User.find_by_sql("update jylc set hdsj='#{rq}',jyzt='4' where id = #{params['id']};")
    render :text => 'success'
  end
  
  def get_p_setting
    if params['mbmc'].nil?
      txt = "{results:0,rows:[]}"
    else
      mbmc = params['mbmc']
      user = User.find_by_sql("select * from p_setting where mbmc='#{mbmc}';")
      size = user.size;
      if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
          txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
      else
        txt = "{results:0,rows:[]}"
      end
    end
    render :text => txt
  end

  def get_p_template
    user = User.find_by_sql("select distinct mbmc from p_setting order by mbmc;")
    size = user.size
    if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end

  def get_mulu_store_1
    if params['dh'].nil?
      txt = "{results:0,rows:[]}"
    else
      dh = params['dh'].gsub('|','_')
      user = User.find_by_sql("select * from timage_tj where dh like '#{dh}%' order by id;")
      size = user.size;
      if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
      else
        txt = "{results:0,rows:[]}"
      end
    end
    render :text => txt
  end
  
  def get_mulu_store
    if params['dh'].nil?
      txt = "{results:0,rows:[]}"
    else
      dh = params['dh']
      fl = params['filter']
     
      if fl.nil? || fl=='全部'
        user = User.find_by_sql("select count(*) from timage_tj where dh_prefix='#{dh}';")
      else
        user = User.find_by_sql("select count(*) from timage_tj where dh_prefix='#{dh}' and zt='#{fl}';")
      end    
      size = user[0].count;
      if size.to_i > 0
          txt = "{results:#{size},rows:["
          if  fl.nil? || fl=='全部'
            user = User.find_by_sql("select * from timage_tj where dh_prefix='#{dh}' order by ajh limit #{params['limit']} offset #{params['start']};")
          else 
            user = User.find_by_sql("select * from timage_tj where dh_prefix='#{dh}' and zt='#{fl}' order by ajh limit #{params['limit']} offset #{params['start']};")
          end    
          size = user.size;
          for k in 0..user.size-1
              txt = txt + user[k].to_json + ','
          end
          txt = txt[0..-2] + "]}"
      else
          txt = "{results:0,rows:[]}"
      end
    end
    render :text => txt
  end

  def prepare_upload_info
    ss = id.split('|')
    user = User.find_by_sql("select id, dwdm from d_dwdm whre id='#{ss[0]}';")
    dwdm = user[0].dwdm
    if ss.size == 3
      qzh, dalb, mlh = ss[0], ss[1], ss[2]
      path = "/share/#{dwdm}/目录#{mlh}"

      tpsl = Dir["#{path}/*.jpg"].size
      user = User.find_by_sql("select count(*) as count from timage where dh like '#{qzh}-#{dalb}-#{mlh}-%';")
      txt = "{results:1,rows:["
      txt = txt + "{mlh:'#{mlh}', tpsl:'#{tpsl}', drtp:'#{user[0].count}'}]}"

    elsif 
      ss.size == 2
    end
    dd = User.find_by_sql("select qzh, dwdm, dalb, mlh from archive where id = #{params['id']};")[0]
    user = User.find_by_sql("select sum(ys) as zys from archive where qzh = '#{dd.qzh}' and dalb = '#{dd.dalb}' and mlh = '#{dd.mlh}';")
    render :text => 'Success'
  end

  def get_dyzt_store
    user = User.find_by_sql("select id, dydh, cast (mlh as integer), dqjh, qajh, zajh, dyzt, dylb from p_status order by mlh;")
    size = user.size;
    if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end

  def get_next_mulu
    qzh, mlh, dalb = params['qzh'], params['mlh'].to_i+1, params['dalb']
    user = User.find_by_sql("select min(ajh), max(ajh), dalb from archive where qzh = '#{qzh}' and mlh = '#{mlh}' group by dalb;")
    data = user[0]
    txt = "({mlh:'#{mlh}', qajh:'#{data.min.to_i}', zajh:'#{data.max.to_i}', dalb:'#{data.dalb}'})"
    render :text => txt
  end

  def get_prev_mulu
    render :text => 'Success'
  end

  def add_print_task
    qzh, mlh, dalb, qajh, zajh = params['qzh'], params['mlh'], params['dalb'], params['qajh'], params['zajh']

    dylb = 0
    dylb += 8 if !params['dylb-1'].nil?
    dylb += 4 if !params['dylb-2'].nil?
    dylb += 2 if !params['dylb-3'].nil?
    dylb += 1 if !params['dylb-4'].nil?
  
    dydh = "#{qzh}-#{dalb}-#{mlh}"
    User.find_by_sql("delete from p_status where dydh='#{dydh}';")
    User.find_by_sql("insert into p_status (dydh, mlh, dqjh, qajh, zajh, dyzt, dylb) values ('#{dydh}', '#{mlh}', '#{qajh}', '#{qajh}', '#{zajh}', '未打印', '#{sprintf("%02b", dylb)}');")
  
    render :text => 'Success'
  end

  def add_print_task_all
    qzh, mlh, dalb, qajh, zajh = params['qzh'], params['mlh'], params['dalb'], params['qajh'], params['zajh']
    dylb = 0
    dylb += 8 if !params['dylb-1'].nil?
    dylb += 4 if !params['dylb-2'].nil?
    dylb += 2 if !params['dylb-3'].nil?
    dylb += 1 if !params['dylb-4'].nil?
  
    if (dalb=='*')
      users = User.find_by_sql("select distinct mlh, dalb from archive where qzh='#{qzh}' order by mlh;")

      for k in 0..users.size-1
        mlh, dalb = users[k].mlh, users[k].dalb
        dydh = "#{qzh}-#{dalb}-#{mlh}"
        User.find_by_sql("delete from p_status where dydh='#{dydh}';")
      
        if zajh.to_i == -1
          user = User.find_by_sql("select min(ajh), max(ajh), dalb from archive where qzh = '#{qzh}' and mlh = '#{mlh}' group by dalb;")
          data =user[0]
          User.find_by_sql("insert into p_status (dydh, mlh, dqjh, qajh, zajh, dyzt, dylb) values ('#{dydh}', '#{mlh}', '0', '#{data['min']}', '#{data['max']}', '未打印', '#{sprintf("%02b", dylb)}');")
        else  
          User.find_by_sql("insert into p_status (dydh, mlh, dqjh, qajh, zajh, dyzt, dylb) values ('#{dydh}', '#{mlh}', '0', '1', '5', '未打印', '#{sprintf("%02b", dylb)}');")
        end
      end
    else
      users = User.find_by_sql("select distinct mlh from archive where qzh='#{qzh}' and dalb='#{dalb}' order by mlh;")
      for k in 0..users.size-1
        mlh = users[k].mlh
        dydh = "#{qzh}-#{dalb}-#{mlh}"
        User.find_by_sql("delete from p_status where dydh='#{dydh}';")
    
        user = User.find_by_sql("select min(ajh), max(ajh), dalb from archive where qzh = '#{qzh}' and mlh = '#{mlh}' group by dalb;")
        data =user[0]
        User.find_by_sql("insert into p_status (dydh, mlh, dqjh, qajh, zajh, dyzt, dylb) values ('#{dydh}', '#{mlh}', '0', '#{data['min']}', '#{data['max']}', '未打印', '#{sprintf("%02b", dylb)}');")
      end
    end
    render :text => 'Success'
  end

  def delete_print_task
    User.find_by_sql("delete from p_status where id in (#{params['id']});")
    render :text => 'Success'
  end

  def delete_all_print_task
    User.find_by_sql("delete from p_status where dyzt = '打印完成';")
    render :text => 'Success'
  end

  def start_print_task
    system 'ruby ./dady/bin/call_print_wizard.rb &'
    render :text => 'Success'
  end

  def update_timage_tj
    dh = params['dh']
    system("ruby ./dady/bin/update_timage_tj.rb #{dh} &")
    render :text => 'Success'
  end

  def print_timage_tj
    dh = params['dh']
    system("ruby ./dady/bin/print_mulu_tj.rb #{dh}")
    render :text => 'Success'
  end
  
  def get_timage_tj_from_db
    if (params['gid'].nil?)
      txt = ""
    else
      if type.to_i = 0
        user = User.find_by_sql("select id, yxmc, data from timage_tjtx where id='#{params['gid']}';")
      else
        user = User.find_by_sql("select id, yxmc, data from timage_tjtx where id='#{params['gid']}';")
      end  
      ss = user[0]["data"] #already escaped
      tt = user[0]["yxmc"]
      local_filename = './dady/img_tmp/'+user[0]["yxmc"]
      small_filename = './dady/img_tmp/'+user[0]["yxmc"]
      File.open(local_filename, 'w') {|f| f.write(ss) }
      system("convert -resize 20% -quality 75 #{local_filename} #{small_filename}")
      txt = "/assets/dady/img_tmp/#{user[0]['yxmc']}"
    end
    render :text => txt    
  end
  
    
  #获得用户目录权限树
  def get_ml_qx_tree
    node, style = params["node"], params['style']
      if node == "root"
        data = User.find_by_sql("select * from  d_dwdm  order by id;")
        text="["
        data.each do |dd|
          text=text+"{'text':'#{dd['dwdm']}','id' :'#{dd['id']}','leaf':false,'checked':false,'cls':'folder','children':["

          dalb=User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id and d_dalb.sx<100 and dwid=#{dd['id']} order by d_dalb.sx;")
          dalb.each do |lb|
            text=text+"{'text':'#{lb['lbmc']}','id' :'#{dd['id']}_#{lb['lbid']}','leaf':false,'checked':false,'cls':'folder','children':["
            if lb['lbid'].to_i>99
            
              dalbrj=User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id  and d_dalb.ownerid=#{lb['lbid']} and dwid=#{dd['id']};")
              dalbrj.each do |dalbrj|
              
                text=text+"{'text':'#{dalbrj['lbmc']}','id' :'#{dd['id']}_#{dalbrj['lbid']}','leaf':false,'checked':false,'cls':'folder','children':["
                dalbml=User.find_by_sql("select * from  d_dw_lb_ml where d_dw_lbid= #{dalbrj['id']} order by id;")
                dalbml.each do |lbml|
                  text=text+"{'text':'#{lbml['mlhjc']}','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}','leaf':false,'checked':false,'cls':'folder','children':["
                  text=text+"{'text':'查询','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}_q','leaf':true,'checked':false,'iconCls':'accordion'},"
                  text=text+"{'text':'打印','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}_p','leaf':true,'checked':false,'iconCls':'print'},"
                  text=text+"{'text':'新增','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}_a','leaf':true,'checked':false,'iconCls':'add'},"
                  text=text+"{'text':'修改','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}_m','leaf':true,'checked':false,'iconCls':'option'},"
                  text=text+"{'text':'删除','id' :'#{dd['id']}_#{dalbrj['lbid']}_#{lbml['id']}_d','leaf':true,'checked':false,'iconCls':'delete'},"
                  text=text+"]},"
                end
                text=text+"]},"
              end
            else
               dalbml=User.find_by_sql("select * from  d_dw_lb_ml where d_dw_lbid= #{lb['id']} order by id;")
               dalbml.each do |lbml|
                 text=text+"{'text':'#{lbml['mlhjc']}','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}','leaf':false,'checked':false,'cls':'folder','children':["
                 text=text+"{'text':'查询','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}_q','leaf':true,'checked':false,'iconCls':'accordion'},"
                 text=text+"{'text':'打印','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}_p','leaf':true,'checked':false,'iconCls':'print'},"
                 text=text+"{'text':'新增','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}_a','leaf':true,'checked':false,'iconCls':'add'},"
                 text=text+"{'text':'修改','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}_m','leaf':true,'checked':false,'iconCls':'option'},"
                 text=text+"{'text':'删除','id' :'#{dd['id']}_#{lb['lbid']}_#{lbml['id']}_d','leaf':true,'checked':false,'iconCls':'delete'},"
                 text=text+"]},"
               end
            end
            text=text+"]},"
           
         end
         text=text+"]},"
        end
        text=text + "]"
        render :text => text
     end
  #  dalb=User.find_by_sql("select * from d_dalb where sx<100 order by sx;")
  #  dalb.each do |lb|
  #    text=text+"{'text':'#{lb['lbdm']}#{lb['lbmc']}','id':'#{lb['id']}','leaf':false,'checked':false,'cls':'folder','children':["
  #    
  #    dalbml=User.find_by_sql("select * from  d_dalb where ownerid=  #{lb['id']} order by id;")
  #    dalbml.each do |lbml|
  #      text=text+"{'text':'#{lbml['lbmc']}','id' :'#{lbml['id']}','leaf':true,'checked':false,'cls':'folder'},"                  
  #    end
  #   text=text+"]},"
  # end
  end

  #获得用户菜单树
  def get_cd_qx_tree
    node, style = params["node"], params['style']
    if node == "root"
    data = User.find_by_sql("select * from  d_cd order by id;")
    text="["
    data.each do |dd|
      text=text+"{'text':'#{dd['cdmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'cls':'folder'},"
    end
    text=text + "]"
    render :text => text
    end
  end

  #获得用户列表
  def  get_user_grid
    user = User.find_by_sql("select * from  users order by id;")

    size = user.size;
    if size > 0 
     txt = "{results:#{size},rows:["
     for k in 0..user.size-1
       txt = txt + user[k].to_json + ','
     end
     txt = txt[0..-2] + "]}"
    else
     txt = "{results:0,rows:[]}"  
    end  
    render :text => txt
  end
  
  #获得用户树
  def get_user_tree
    node, style = params["node"], params['style']
    if node == "root"
      data = User.find_by_sql("select * from  users order by id;")
      text="["
      data.each do |dd|
      text=text+"{'text':'#{dd['email']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
    end
      text=text + "]"
      render :text => text
    end
  end
 
  #获得档案类别树
  def get_lb_tree
    node, style = params["node"], params['style']
    if node == "root"
      #data = User.find_by_sql("select * from  d_dalb order by id;")
      text="[{'text':'档案类别','id' :'root1','leaf':false,'checked':false,'expanded':true,'cls':'folder','children':["
      dalb=User.find_by_sql("select * from d_dalb where sx<100 order by sx;")
      dalb.each do |lb|
        text=text+"{'text':'#{lb['lbdm']}#{lb['lbmc']}','id':'#{lb['id']}','leaf':false,'checked':false,'cls':'folder','children':["
        
        dalbml=User.find_by_sql("select * from  d_dalb where ownerid=  #{lb['id']} order by id;")
        dalbml.each do |lbml|
          text=text+"{'text':'#{lbml['lbmc']}','id' :'#{lbml['id']}','leaf':true,'checked':false,'cls':'folder'},"                  
        end
       text=text+"]},"
     end
    # data.each do |dd|
    #     text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
    # end
      text=text + "]}]"
      render :text => text
    end
  end
  
  #获得全宗档案类别树
  def get_qz_lb_tree
    if !(params['id'].nil?)
      if (params['id']=='')
        data = User.find_by_sql("select * from  d_dw_lb  order by id;")
        text="["
        data.each do |dd|
          text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
        end
        text=text + "]"
        render :text => text         
      else
        data = User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc,d_dalb.ownerid from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id and d_dalb.sx<100 and dwid = #{params['id']} order by d_dalb.sx;")
        text="["
        
        data.each do |dd|
          
          if dd['lbid'].to_i>99  
            text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','checked':false,'cls':'folder','children':["        
            dalbrj=User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id  and d_dalb.ownerid=#{dd['lbid']} and dwid=#{params['id']};")
            dalbrj.each do |dalbrj|            
              text=text+"{'text':'#{dalbrj['lbmc']}','id' :'#{dalbrj['id']}','leaf':true,'checked':false,'cls':'folder'},"
            end
            text=text+"]},"
          else
             text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'cls':'folder'}," 
          end
          
        end
        text=text + "]"
        render :text => text
      end
    end
  end
  
  #获得全宗档案类别目录树
  def get_qz_lb_ml_tree
    if !(params['id'].nil?)
      if (params['id']=='')
         data = User.find_by_sql("select * from  d_dw_lb_ml  order by id;")
         text="["
         data.each do |dd|
           text=text+"{'text':'#{dd['mlhjc']}_#{dd['mlh']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
        end
        text=text + "]"
        render :text => text         
      else
        data = User.find_by_sql("select * from  d_dw_lb_ml where d_dw_lbid = #{params['id']} order by id;")
        text="["
        data.each do |dd|
          text=text+"{'text':'#{dd['mlhjc']}_#{dd['mlh']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
        end
        text=text + "]"
        render :text => text
       end
    end
  end
 
  #获得全宗档案类别
  def get_qz_lb
    data = User.find_by_sql("select * from  d_dw_lb where dwid = #{params['id']} order by id;")
    text=""
    data.each do |dd|
      if text==""
        text="#{dd['lbid']}" 
      else
        text=text+"|#{dd['lbid']}" 
      end
    end
    render :text => text      
  end
 
  #保存用户目录菜单权限
  def insert_qz_lb
    User.find_by_sql("delete from d_dw_lb where dwid = #{params['qzid']};")
    ss = params['insert_qx'].split('$')
    for k in 0..ss.length-1
      qx=ss[k].split(';')       
      if qx[0]=="root1"  
      else
        User.find_by_sql("insert into d_dw_lb(dwid, lbid, lbmc) values ('#{params['qzid']}', '#{qx[0]}','#{qx[1]}');")
      end
    end
    render :text => 'success'
  end

  #保存全宗档案类别目录
  def insert_qz_lb_ml
    user=User.find_by_sql("select *  from d_dw_lb_ml where d_dw_lbid = #{params['d_dw_lbid']}  and (mlhjc='#{params['mlhjc']}' or mlh='#{params['mlh']}');")
    size = user.size;
    if size == 0
      User.find_by_sql("insert into d_dw_lb_ml(d_dw_lbid, mlhjc, mlh) values ('#{params['d_dw_lbid']}', '#{params['mlhjc']}','#{params['mlh']}');")
      render :text => 'success'
    else
      render :text => '同一全宗档案类别下的目录号说明或目录号不能有重复，请重新输入目录号说明和目录。'
    end
  end
 
  #初使化全宗档案类别目录，根据archive表中的信息初使化全宗档案类别目录
  def ini_qz_lb_ml
    User.find_by_sql("delete from d_dw_lb_ml;")
    User.find_by_sql("delete from qx_mlqx;")
   user=User.find_by_sql("select distinct qzh,dalb, mlh from archive order by qzh,dalb, mlh;")
   size = user.size;
   if size > 0
     user.each do |dd|
      data=User.find_by_sql("select * from d_dw_lb where dwid='#{dd['qzh']}' and lbid='#{dd['dalb']}';")
      size1 = data.size;
      if size1 > 0
        User.find_by_sql("insert into d_dw_lb_ml(d_dw_lbid, mlhjc, mlh) values ('#{data[0]['id']}', '目录号#{dd['mlh']}','#{dd['mlh']}');")
      end
     end
     render :text => 'success'
   else
     render :text => 'archive表中无数据。'
   end
  end
 
  #获得用户权限
  def get_user_qx
    data = User.find_by_sql("select * from  qx_mlqx where user_id = #{params['userid']} order by id;")
    text=""
    data.each do |dd|
      if text==""
        text="#{dd['qxdm']}" + ";" +"#{dd['qxlb']}"
      else
        text=text+"|#{dd['qxdm']}" + ";" +"#{dd['qxlb']}"
      end
    end
    render :text => text      
  end
 
  #保存用户目录菜单权限
  def insert_user_qx
   User.find_by_sql("delete from qx_mlqx where user_id = #{params['userid']};")
   ss = params['insert_qx'].split('$')
   for k in 0..ss.length-1
     qx=ss[k].split(';')
     ids=qx[0].split('_')
     if qx[2]=="0"
       if ids.length==4
         id=ids[ids.length-2]
         User.find_by_sql("insert into qx_mlqx(qxdm, qxmc, user_id,qxid,qxlb,qx) values ('#{qx[0]}', '#{qx[1]}',#{params['userid']},'#{id}',#{ids.length-1},'#{ids[ids.length-1]}');")
       else
         id=ids[ids.length-1]
         User.find_by_sql("insert into qx_mlqx(qxdm, qxmc, user_id,qxid,qxlb) values ('#{qx[0]}', '#{qx[1]}',#{params['userid']},'#{id}',#{ids.length-1});")
       end
     else
       User.find_by_sql("insert into qx_mlqx(qxdm, qxmc, user_id,qxid,qxlb) values ('#{qx[0]}', '#{qx[1]}',#{params['userid']},'#{qx[0]}',4);")
     end
   end
    render :text => 'success'
  end

  #更新用户信息
  def update_user
   user=User.find_by_sql("select * from users where id <> #{params['id']} and email='#{params['email']}';")
   size = user.size
   if size == 0
     User.find_by_sql("update users set email='#{params['email']}', encrypted_password='#{params['encrypted_password']}' where id = #{params['id']};")
     txt='success'
   else
     txt= '用户名称已经存在，请重新输入用户名称。'
   end
   render :text => txt
  end
  
  #新增用户信息
  def insert_user
    #logger.debug  User。id
    user=User.find_by_sql("select * from users where  email='#{params['email']}';")
    size = user.size
    if size == 0
   
      user = User.new
   
      user.email=params['email']
   
      user.password_confirmation=params['encrypted_password']
   
      user.password = params['encrypted_password']
      user.save
   
      txt='success'
    else
      txt= '用户名称已经存在，请重新输入用户名称。'
    end
    render :text => txt
  end
  
  #删除用户信息
  def delete_user
    user=User.find_by_sql("delete from users where  id=#{params['id']};")
    render :text => 'success'
  end
  
  #删除档案类别目录信息
  def delete_qz_lb_ml
    user=User.find_by_sql("SELECT  d_dw_lb.dwid,d_dw_lb_ml.mlh,d_dw_lb.lbid FROM  d_dw_lb_ml, d_dw_lb WHERE  d_dw_lb.id = d_dw_lb_ml.d_dw_lbid and d_dw_lb_ml.id=#{params['id']};")   
    size = user.size;
    txt="";
    if size > 0 
      data=User.find_by_sql("select count(*) from archive where mlh='#{user[0]['mlh']}' and qzh='#{user[0]['dwid']}' and dalb='#{user[0]['lbid']}'")
      size1 = data[0]['count'];

      if size1.to_i > 0
        txt= '此目录号里面有数据。无法删除。'
      else
        User.find_by_sql("delete from d_dw_lb_ml where  id=#{params['id']};")
        txt= 'success'
      end
      
    else
      txt= '此目录号信息有问题。不能删除。'
    end
    render :text =>txt
  end
  
  #删除全宗信息
  def delete_qz
    user=User.find_by_sql("delete from d_dwdm where  id=#{params['id']};")
    render :text => 'success'
  end

  #获得全宗列表
  def get_qz_grid
    user = User.find_by_sql("select * from  d_dwdm order by id;")
    size = user.size;
    if size > 0 
     txt = "{results:#{size},rows:["
     for k in 0..user.size-1
       txt = txt + user[k].to_json + ','
     end
     txt = txt[0..-2] + "]}"
    else
     txt = "{results:0,rows:[]}"  
    end  
    render :text => txt
  end
  
  #更新全宗信息
  def update_qz
    user=User.find_by_sql("select * from d_dwdm where id <> #{params['id']} and dwdm='#{params['dwdm']}';")
    size = user.size
    if size == 0
      User.find_by_sql("update d_dwdm set dwdm='#{params['dwdm']}', dwjc='#{params['dwjc']}' where id = #{params['id']};")
      txt='success'
    else
      txt= '全宗名称已经存在，请重新输入全宗名称。'
    end
    render :text => txt
  end
  
  #新增全宗信息
  def insert_qz
    user=User.find_by_sql("select * from d_dwdm where  dwdm='#{params['dwdm']}';")
    size = user.size
    if size == 0
      User.find_by_sql("insert into d_dwdm(dwdm, dwjc) values ('#{params['dwdm']}', '#{params['dwjc']}');")
      txt='success'
    else
      txt= '全宗名称已经存在，请重新输入全宗名称。'
    end
    render :text => txt
  end
  
  def check_jylist
    jyid=""
    if !(params['jy_aj_list']=='')
      user = User.find_by_sql("select daid,jyid from jylist where  hdsj IS NULL and daid in (#{params['jy_aj_list']});")
      jyid=user[0]["jyid"]
      size = user.size;
      if size > 0
        txt = ""
        for k in 0..user.size-1
          if !(txt=='')
            txt = txt +"," + user[k]["daid"] 
          else
            txt =  user[k]["daid"] 
          end
        end
        user = User.find_by_sql("select dh from archive where  id in (#{txt});")
        txt=""
        for k in 0..user.size-1
          if !(txt=='')
            txt = txt +"," + user[k]["dh"] 
          else
            txt =  user[k]["dh"] 
          end
        end
        user = User.find_by_sql("select jyr from jylc where  id = #{jyid};")
        render :text => "档号为：" + txt+ "已被" +user[0]["jyr"] + "借走，请重新借阅。"
      else
        render :text => "success"
      end
    else
      render :text => "检查失败。"
    end
  end
  
  def export
    headers['Content-Type'] = "application/vnd.ms-excel"
    headers['Content-Disposition'] = 'attachment; filename="report.xls"'
    headers['Cache-Control'] = ''
    @users = User.find(:all)
  end
  
  #通过用户id来获得此用户可查看的目录tree
  def get_treeforuserid
    text = "[]"
    userid=""
    node, style = params["node"], params['style']
      if node == "root"
        user= User.find_by_sql("select jsid from u_js where userid=  '#{params["userid"]}' order by id;")
        user.each do |us|
          logger.debug us['jsid']
          if userid==""
            userid=us['jsid']
          else
            userid=userid + "," +us['jsid']
          end
        end
        if userid!=""
          data = User.find_by_sql("select distinct qxdm ,qxmc from  qx_mlqx where user_id in (#{userid}) and qxlb=0 order by qxdm;")
          text="["
          data.each do |dd|
            text=text+"{'text':'#{dd['qxmc']}','id' :'#{dd['qxdm']}','leaf':false,'cls':'folder','children':["
            logger.debug "权限名称"+dd['qxmc']
            dalb = User.find_by_sql("select distinct qxdm,qxmc,qxid,sx from  qx_mlqx,d_dalb where qx_mlqx.qxid = d_dalb.id and qx_mlqx.qxlb=1 and d_dalb.sx<100 and qx_mlqx.user_id in (#{userid}) and qxdm like '#{dd['qxdm']}\\_%' order by d_dalb.sx;")
            dalb.each do |lb|
              if lb['qxid'].to_i>99  
                text=text+"{'text':'#{lb['qxmc']}','id':'#{lb['qxdm']}','leaf':false,'cls':'folder','children':["
                logger.debug "权限名称"+lb['qxmc']
                dalbej=User.find_by_sql("select distinct qxdm,qxmc,qxid,d_dalb.id from  qx_mlqx,d_dalb where qx_mlqx.qxid = d_dalb.id and qx_mlqx.qxlb=1 and d_dalb.ownerid='#{lb['qxid']}' and qx_mlqx.user_id in (#{userid}) and qxdm like '#{dd['qxdm']}\\_%' order by d_dalb.id;")
                dalbej.each do |lbml|
                  
                  text=text+"{'text':'#{lbml['qxmc']}','id':'#{lbml['qxdm']}','leaf':false,'cls':'folder','children':["
                  dalbml=User.find_by_sql("select distinct qx_mlqx.qxdm, d_dw_lb_ml.mlhjc from  qx_mlqx,d_dw_lb_ml where qx_mlqx.qxid = d_dw_lb_ml.id and qxlb=2 and user_id in (#{userid})  and qxdm like '#{lbml['qxdm']}\\_%' order by qxdm;")
                  dalbml.each do |ml|
                    text=text+"{'text':'#{ml['mlhjc']}','id' :'#{ml['qxdm']}','leaf':true,'cls':'folder'},"                  
                  end  
                  text=text+"]},"               
                end
                
              else
                text=text+"{'text':'#{lb['qxmc']}','id':'#{lb['qxdm']}','leaf':false,'cls':'folder','children':["
                dalbml=User.find_by_sql("select distinct qx_mlqx.qxdm, d_dw_lb_ml.mlhjc from  qx_mlqx,d_dw_lb_ml where qx_mlqx.qxid = d_dw_lb_ml.id and qxlb=2 and user_id in (#{userid})  and qxdm like '#{lb['qxdm']}\\_%' order by qxdm;")
                dalbml.each do |ml|
                  text=text+"{'text':'#{ml['mlhjc']}','id' :'#{ml['qxdm']}','leaf':true,'cls':'folder'},"                  
                end
              end
             text=text+"]},"
           end
           text=text+"]},"
          end
          text=text + "]"  
        
        end 
      end
   #     data = User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc,d_dalb.ownerid from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id and d_dalb.sx<100 and dwid = #{params['id']} order by d_dalb.sx;")
   #     text="["
        
   #     data.each do |dd|
          
  #     if dd['lbid'].to_i>99  
  #       text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','checked':false,'cls':'folder','children':["        
  #       dalbrj=User.find_by_sql("select d_dw_lb.id, d_dw_lb.dwid, d_dw_lb.lbid, d_dw_lb.lbmc from  d_dw_lb,d_dalb where d_dw_lb.lbid = d_dalb.id  and d_dalb.ownerid=#{dd['lbid']} and dwid=#{params['id']};")
  #       dalbrj.each do |dalbrj|            
  #         text=text+"{'text':'#{dalbrj['lbmc']}','id' :'#{dalbrj['id']}','leaf':true,'checked':false,'cls':'folder'},"
  #       end
  #       text=text+"]},"
  #     else
  #        text=text+"{'text':'#{dd['lbmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'cls':'folder'}," 
  #     end
  #     
  #   end
  #   text=text + "]"   
  #     data = User.find_by_sql("select * from  qx_mlqx where user_id=  #{params["userid"]} and qxlb=0 order by id;")
  #     text="["
  #     data.each do |dd|
  #       text=text+"{'text':'#{dd['qxmc']}','id' :'#{dd['qxdm']}','leaf':false,'cls':'folder','children':["
  #
  #       dalb=User.find_by_sql("select * from  qx_mlqx where user_id=  #{params["userid"]} and qxlb=1 and qxdm like '#{dd['qxdm']}_%' order by id;")
  #       dalb.each do |lb|
  #         text=text+"{'text':'#{lb['qxmc']}','id' :'#{lb['qxdm']}','leaf':false,'cls':'folder','children':["
  #         dalbml=User.find_by_sql("select * from  qx_mlqx where user_id=  #{params["userid"]} and qxlb=2 and qxdm like '#{lb['qxdm']}_%' order by id;")
  #         dalbml.each do |lbml|
  #           text=text+"{'text':'#{lbml['qxmc']}','id' :'#{lbml['qxdm']}','leaf':true,'cls':'folder'},"
  #           
  #
  #        end
  #        text=text+"]},"
  #      end
  #      text=text+"]},"
  #     end
  #     text=text + "]"
        
     

    render :text => text
  end

  def get_mlh
    ss = params['dalb']
       txt=""
       dalb = User.find_by_sql("select * from d_dw_lb_ml where id =  '#{ss}';")
       size = dalb.size;
       if size>0
         txt=dalb[0]['mlh']
       else
         txt="0"
       end
       render :text => txt
  end
  
  #根据dw_lbid 获得最大案卷号
  def get_max_ajh
    ss = params['dalb'].split('_')
       txt=""
       if params['qx']==true
         dalb = User.find_by_sql("select * from d_dw_lb_ml where id =  '#{ss[2]}';")
         size = dalb.size;
         if size>0
           #txt=dalb[0]['mlh']
           ajh= User.find_by_sql("select max(ajh) from archive where mlh ='#{dalb[0]['mlh']}' and qzh='#{ss[0]}' and dalb='#{ss[1]}';")
           size=ajh.size;
           txt=ajh[0]["max"].to_i+1;
         else
           txt="0"
         end
       else
          ajh= User.find_by_sql("select max(ajh) from archive where mlh ='#{ss[2]}' and qzh='#{ss[0]}' and dalb='#{ss[1]}';")
          size=ajh.size;
          txt=ajh[0]["max"].to_i+1;
       end
       render :text => txt
  end
  
  #通过权限代码来获得archive
  def get_archive_qxdm
    if (params['query'].nil?)
      txt = "{results:0,rows:[]}"
    else
      ss = params['query'].split('_')
      if ss.length>2
        data=User.find_by_sql("select * from d_dw_lb_ml where id = '#{ss[2]}';")
        size = data.size;
      
        if size>0
          
            user = User.find_by_sql("select count(*) from archive where qzh = '#{ss[0]}' and dalb = '#{ss[1]}' and mlh = '#{data[0]['mlh']}';")
            size = user[0].count;
  
            if size.to_i > 0
                txt = "{results:#{size},rows:["
                case (ss[1]) 
                  when "0"
                    user = User.find_by_sql("select * from archive where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}' order by ajh limit #{params['limit']} offset #{params['start']};")
                   
                  when "2"
                    user = User.find_by_sql("select archive.*,a_jhcw.pzqh,a_jhcw.pzzh,a_jhcw.jnzs,a_jhcw.fjzs from archive left join a_jhcw on archive.id=a_jhcw.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                    
                  when "3","5","6","7"
                    user = User.find_by_sql("select archive.*,a_tddj.djh,a_tddj.qlrmc,a_tddj.tdzl,a_tddj.qsxz,a_tddj.tdzh,a_tddj.tfh,a_tddj.ydjh from archive left join a_tddj on archive.id=a_tddj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "15"
                    user = User.find_by_sql("select archive.*,a_sx.zl from archive left join a_sx on archive.id=a_sx.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "18"
                    user = User.find_by_sql("select archive.*,a_tjml.tfh,a_tjml.tgh from archive left join a_tjml on archive.id=a_tjml.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "25"
                    user = User.find_by_sql("select archive.*,a_dzda.tjr, a_dzda.rjhj, a_dzda.czxt, a_dzda.sl, a_dzda.bfs, a_dzda.ztbhdwjgs, a_dzda.yyrjpt, a_dzda.tjdw, a_dzda.wjzt, a_dzda.dzwjm, a_dzda.ztbh, a_dzda.xcbm, a_dzda.xcrq, a_dzda.jsr, a_dzda.jsdw, a_dzda.yjhj from archive left join a_dzda on archive.id=a_dzda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "27"
                    user = User.find_by_sql("select archive.*,a_sbda.zcmc, a_sbda.gzsj, a_sbda.dw, a_sbda.sl, a_sbda.cfdd, a_sbda.sybgdw, a_sbda.sybgr, a_sbda.jh, a_sbda.zcbh, a_sbda.dj, a_sbda.je from archive left join a_sbda on archive.id=a_sbda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "26"
                    user = User.find_by_sql("select archive.*,a_jjda.xmmc, a_jjda.jsdw from archive left join a_jjda on archive.id=a_jjda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "28"
                    user = User.find_by_sql("select archive.*,a_swda.bh, a_swda.lb, a_swda.hjz, a_swda.sjsj, a_swda.sjdw, a_swda.mc, a_swda.ztxsfrom archive left join a_swda on archive.id=a_swda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "29"
                    user = User.find_by_sql("select archive.*,a_zlxx.bh, a_zlxx.lb, a_zlxx.bzdw from archive left join a_zlxx on archive.id=a_zlxx.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}'  order by ajh limit #{params['limit']} offset #{params['start']};")
                  when "30"
                    user = User.find_by_sql("select archive.*,a_by_tszlhj.djh, a_by_tszlhj.kq, a_by_tszlhj.mc, a_by_tszlhj.fs, a_by_tszlhj.yfdw, a_by_tszlhj.cbrq, a_by_tszlhj.dj from archive left join a_by_tszlhj on archive.id=a_by_tszlhj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by djh limit #{params['limit']} offset #{params['start']};")
                  when "31"
                    user = User.find_by_sql("select archive.*,a_by_jcszhb.zt, a_by_jcszhb.qy, a_by_jcszhb.tjsj, a_by_jcszhb.sm from archive left join a_by_jcszhb on archive.id=a_by_jcszhb.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by zt limit #{params['limit']} offset #{params['start']};")
                  when "32"
                    user = User.find_by_sql("select archive.*,a_by_zzjgyg.jgmc, a_by_zzjgyg.zzzc, a_by_zzjgyg.qzny from archive left join a_by_zzjgyg on archive.id=a_by_zzjgyg.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by jgmc limit #{params['limit']} offset #{params['start']};")
                  when "33"
                    user = User.find_by_sql("select archive.*,a_by_dsj.dd, a_by_dsj.jlr, a_by_dsj.clly, a_by_dsj.fsrq, a_by_dsj.jlrq, a_by_dsj.rw, a_by_dsj.sy,a_by_dsj.yg from archive left join a_by_dsj on archive.id=a_by_dsj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by fsrq limit #{params['limit']} offset #{params['start']};")
                  when "34"
                    user = User.find_by_sql("select archive.*,a_by_qzsm.qzgcgjj, a_by_qzsm.sj from archive left join a_by_qzsm on archive.id=a_by_qzsm.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by sj limit #{params['limit']} offset #{params['start']};")
                  
                  when "24"
                    user = User.find_by_sql("select archive.dwdm,archive.dh,archive.bz,archive.mlh,archive.flh,archive.id,archive.ys,archive.tm,archive.dalb,archive.qzh,a_wsda.jh,a_wsda.hh, a_wsda.zwrq, a_wsda.wh, a_wsda.zrr, a_wsda.gb, a_wsda.wz, a_wsda.ztgg, a_wsda.ztlx, a_wsda.ztdw, a_wsda.dagdh, a_wsda.dzwdh, a_wsda.swh, a_wsda.ztsl, a_wsda.qwbs, a_wsda.ztc, a_wsda.zbbm, a_wsda.ownerid, a_wsda.nd, a_wsda.jgwth, a_wsda.gbjh, a_wsda.xbbm, a_wsda.bgqx from archive left join a_wsda on archive.id=a_wsda.ownerid where archive.qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by nd,bgqx,jgwth,jh limit #{params['limit']} offset #{params['start']};")
                  
                  else
                    user = User.find_by_sql("select * from archive where qzh = '#{ss[0]}' and dalb ='#{ss[1]}' and mlh = '#{data[0]['mlh']}' order by ajh limit #{params['limit']} offset #{params['start']};")
                    
                end
                
                size = user.size;
                for k in 0..user.size-1
                    txt = txt + user[k].to_json + ','
                end
                txt = txt[0..-2] + "]}"
            else
                txt = "{results:0,rows:[]}"
            end
          
        else
          txt = "{results:0,rows:[]}"
        end
      else
        
          user = User.find_by_sql("select count(*) from archive where qzh = '#{ss[0]}' and dalb = '#{ss[1]}' ;")
          size = user[0].count;

          if size.to_i > 0
              txt = "{results:#{size},rows:["
              case (ss[1]) 
                when "0"
                  user = User.find_by_sql("select * from archive where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'  order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                  
                when "2"
                  user = User.find_by_sql("select archive.*,a_jhcw.pzqh,a_jhcw.pzzh,a_jhcw.jnzs,a_jhcw.fjzs from  archive left join a_jhcw on archive.id=a_jhcw.ownerid  where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'  order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                  
                when "3" ,"5","6","7"
                  user = User.find_by_sql("select archive.*,a_tddj.* from archive left join a_tddj on archive.id=a_tddj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "15"
                  user = User.find_by_sql("select archive.*,a_sx.zl from archive left join a_sx on archive.id=a_sx.ownerid  where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'  order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "18"
                  user = User.find_by_sql("select archive.*,a_tjml.tfh,a_tjml.tgh from archive left join a_tjml on archive.id=a_tjml.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "25"
                  user = User.find_by_sql("select archive.*,a_dzda.tjr, a_dzda.rjhj, a_dzda.czxt, a_dzda.sl, a_dzda.bfs, a_dzda.ztbhdwjgs, a_dzda.yyrjpt, a_dzda.tjdw, a_dzda.wjzt, a_dzda.dzwjm, a_dzda.ztbh, a_dzda.xcbm, a_dzda.xcrq, a_dzda.jsr, a_dzda.jsdw, a_dzda.yjhj from archive left join a_dzda on archive.id=a_dzda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "27"
                  user = User.find_by_sql("select archive.*,a_sbda.zcmc, a_sbda.gzsj, a_sbda.dw, a_sbda.sl, a_sbda.cfdd, a_sbda.sybgdw, a_sbda.sybgr, a_sbda.jh, a_sbda.zcbh, a_sbda.dj, a_sbda.je from archive left join a_sbda on archive.id=a_sbda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "26"
                  user = User.find_by_sql("select archive.*,a_jjda.xmmc, a_jjda.jsdw from archive left join a_jjda on archive.id=a_jjda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "28"
                  user = User.find_by_sql("select archive.*,a_swda.bh, a_swda.lb, a_swda.hjz, a_swda.sjsj, a_swda.sjdw, a_swda.mc, a_swda.ztxsfrom archive left join a_swda on archive.id=a_swda.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "29"
                  user = User.find_by_sql("select archive.*,a_zlxx.bh, a_zlxx.lb, a_zlxx.bzdw from archive left join a_zlxx on archive.id=a_zlxx.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                when "30"
                  user = User.find_by_sql("select archive.*,a_by_tszlhj.djh, a_by_tszlhj.kq, a_by_tszlhj.mc, a_by_tszlhj.fs, a_by_tszlhj.yfdw, a_by_tszlhj.cbrq, a_by_tszlhj.dj from archive left join a_by_tszlhj on archive.id=a_by_tszlhj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by djh limit #{params['limit']} offset #{params['start']};")
                when "31"
                  user = User.find_by_sql("select archive.*,a_by_jcszhb.zt, a_by_jcszhb.qy, a_by_jcszhb.tjsj, a_by_jcszhb.sm from archive left join a_by_jcszhb on archive.id=a_by_jcszhb.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by zt limit #{params['limit']} offset #{params['start']};")
                when "32"
                  user = User.find_by_sql("select archive.*,a_by_zzjgyg.jgmc, a_by_zzjgyg.zzzc, a_by_zzjgyg.qzny from archive left join a_by_zzjgyg on archive.id=a_by_zzjgyg.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by jgmc limit #{params['limit']} offset #{params['start']};")
                when "33"
                  user = User.find_by_sql("select archive.*,a_by_dsj.dd, a_by_dsj.jlr, a_by_dsj.clly, a_by_dsj.fsrq, a_by_dsj.jlrq, a_by_dsj.rw, a_by_dsj.sy,a_by_dsj.yg from archive left join a_by_dsj on archive.id=a_by_dsj.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by fsrq limit #{params['limit']} offset #{params['start']};")
                when "34"
                  user = User.find_by_sql("select archive.*,a_by_qzsm.qzgcgjj, a_by_qzsm.sj from archive left join a_by_qzsm on archive.id=a_by_qzsm.ownerid where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by sj limit #{params['limit']} offset #{params['start']};")

                
                when "24"
                  user = User.find_by_sql("select archive.dh, archive.bz,archive.mlh,archive.flh,archive.ys,archive.mj,archive.id,archive.tm,archive.dalb,archive.qzh,a_wsda.jh, a_wsda.hh,a_wsda.zwrq, a_wsda.wh, a_wsda.zrr, a_wsda.gb, a_wsda.wz, a_wsda.ztgg, a_wsda.ztlx, a_wsda.ztdw, a_wsda.dagdh, a_wsda.dzwdh, a_wsda.swh, a_wsda.ztsl, a_wsda.qwbs, a_wsda.ztc, a_wsda.zbbm, a_wsda.ownerid, a_wsda.nd, a_wsda.jgwth, a_wsda.gbjh, a_wsda.xbbm, a_wsda.bgqx from  archive left join a_wsda on archive.id=a_wsda.ownerid  where archive.qzh = '#{ss[0]}' and dalb ='#{ss[1]}'   order by nd,bgqx,jgwth,jh limit #{params['limit']} offset #{params['start']};")
                  
                else
                  user = User.find_by_sql("select * from archive where qzh = '#{ss[0]}' and dalb ='#{ss[1]}'  order by mlh,ajh limit #{params['limit']} offset #{params['start']};")
                  
                end
              
              size = user.size;
              for k in 0..user.size-1
                  txt = txt + user[k].to_json + ','
              end
              txt = txt[0..-2] + "]}"
          else
              txt = "{results:0,rows:[]}"
          end
        
      end
    end
    render :text => txt
  end
  
  #删除案卷
  def delete_archive
    case params['dalb']
    when "0"
      User.find_by_sql("delete from archive  where id = #{params['id']};")     
    when "2"
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_jhcw  where ownerid = #{params['id']};")
    when "3","5","6","7"
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_tddj  where ownerid = #{params['id']};")
    when "15"
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_sx  where ownerid = #{params['id']};")
    when "18"
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_tjml where ownerid = #{params['id']};")
    when "24"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_wsda  where ownerid = #{params['id']};")
    when "25"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_dzda  where ownerid = #{params['id']};")
    when "28"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_swda  where ownerid = #{params['id']};")
    when "26"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_jjda  where ownerid = #{params['id']};")
    when "29"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_zlxx  where ownerid = #{params['id']};")
    when "30"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_by_tszlhj  where ownerid = #{params['id']};")
    when "31"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_by_jcszhb  where ownerid = #{params['id']};")
    when "32"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_by_zzjgyg  where ownerid = #{params['id']};")
    when "33"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_by_dsj  where ownerid = #{params['id']};")
    when "34"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_by_qzsm  where ownerid = #{params['id']};")
    when "27"     
      User.find_by_sql("delete from archive  where id = #{params['id']};")
      User.find_by_sql("delete from a_sbda  where ownerid = #{params['id']};")
    else
      User.find_by_sql("delete from archive  where id = #{params['id']};")
    end
    

    render :text => 'success'
  end

  def scan_aj
    qz_path = params['qz_path']
    if !qz_path.nil?
      system("./dady/bin/scan_aj.rb ./dady/tmp1/#{qz_path}")
    end
    render :text => 'Success'
  end  
  
  def get_qzgl_store
    where_str = "where qzh=#{params['qzh']} "

    fl = params['filter']
    where_str = where_str + " and zt= '#{fl}' " if !(fl.nil?) && fl !='全部'
    
    dalb = params['dalb']
    where_str = where_str + " and dalb = '#{dalb}' " if !(dalb.nil?) && dalb !=''

    user = User.find_by_sql("select * from q_qzxx #{where_str} order by mlh;")
    
    size = user.size;
    if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt  
  end 
  
  def print_selected_qztj
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh = ss[0], ss[1], ss[2]
      User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dd.dh_prefix}','#{mlh}', 'ruby ./dady/bin/print_mulu_tj.rb #{dd.dh_prefix} ', '', '', '未开始');")
    end  
    render :text => 'Success'
  end
  
  def import_selected_aj
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh = ss[0], ss[1], ss[2]

      if !user[0].json.nil?
        json=dd.json
        User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dd.dh_prefix}','#{mlh}', 'ruby ./dady/bin/upload_mulu.rb  #{json} 泰州市国土资源局 #{qzh} tz ', '', '', '未开始');")
      else 
        render :text => 'JSON is Empty'
      end    
    end  
    render :text => 'Success'
  end
  
  def import_selected_image
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh, dh_prefix = ss[0], ss[1], ss[2], dd.dh_prefix
      yxwz=dd.yxwz
      if !yxwz.nil? 
        User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dh_prefix}','#{mlh}', 'ruby ./dady/bin/import_image.rb #{dh_prefix} #{yxwz}', '', '', '未开始');")
      end  
    end  
    render :text => 'Success'
  end
  
  def export_selected_image
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh, dh_prefix = ss[0], ss[1], ss[2], dd.dh_prefix

      User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dh_prefix}','#{mlh}', 'ruby ./dady/bin/export_image.rb #{dh_prefix} 1 /share/export', '', '', '未开始');")
    end  
    render :text => 'Success'
  end
  
  def get_qzzt_store
    user = User.find_by_sql("select * from q_status order by mlh;")
    size = user.size;
    if size > 0
        txt = "{results:#{size},rows:["
        for k in 0..user.size-1
            txt = txt + user[k].to_json + ','
        end
        txt = txt[0..-2] + "]}"
    else
        txt = "{results:0,rows:[]}"
    end
    render :text => txt  
  end      
  
  def delete_qzzt_task
    User.find_by_sql("delete from q_status where id in (#{params['id']});")
    render :text => 'Success'
  end

  def delete_all_qzzt_task
    User.find_by_sql("delete from q_status where zt = '完成';")
    render :text => 'Success'
  end

  def start_qzzt_task
    system 'ruby ./dady/bin/call_qz_task.rb &'
    render :text => 'Success'
  end
  
  def update_qzxx
    qzh = params['qzh']
    system("ruby ./dady/bin/update_qzxx.rb #{qzh} > ./log/update_qzxx &")
    render :text => 'Success'
  end
  
  def update_qzxx_selected
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh = ss[0], ss[1], ss[2]
      system("ruby ./dady/bin/update_timage_tj2.rb #{dd.dh_prefix}")
    end  
    render :text => 'Success'
  end
  
  def save_mulu_info
    id, mlh, lijr, jmcr, yxwz = params['id'], params['mlh'],params['lijr'], params['jmcr'],params['yxwz']
    User.find_by_sql("update q_qzxx set yxwz='#{yxwz}', lijr='#{lijr}', jmcr='#{jmcr}' where id=#{id} ;")
    render :text => 'Success'
  end
  
  def lookup(yxwz)
    line=''
    Find.find(yxwz) do |path|
      if path.include?'jpg'
        puts "processing #{path}"
        line = path.split('/')[0..-2].join('/')
        break
      end  
    end
    line
  end
  
  def import_selected_timage_aj
    user = User.find_by_sql("select * from timage_tj where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh.split('-')
      qzh, dalb, mlh, ajh, dh_prefix = ss[0], ss[1], ss[2], ss[3], dd.dh_prefix
      
      qzxx=User.find_by_sql("select * from q_qzxx where dh_prefix='#{dd.dh_prefix}';")[0]
      yxgs=User.find_by_sql("select id, yxmc, yxbh from timage where dh like '#{dh_prefix}-%' limit 1;")
      
      #if yxgs.size > 0
      #  yy=yxgs[0].yxmc.split('$') 
      #  yxmc = "#{yy[0]}\$#{yy[1][0..0]}\$#{ajh.rjust(4,'0')}"
      #  path = "#{qzxx.yxwz}/#{yxmc}".gsub('$','\$')
      #  User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dh_prefix}','#{mlh}', 'ruby ./dady/bin/import_image.rb #{dh_prefix} #{path} #{ajh}', '', '', '未开始');")
      #else
        yxgs = lookup(qzxx.yxwz)
        if yxgs.length > 0
          #yy=yxgs.split('$') 
          #yxmc = "#{yy[0]}\$#{yy[1][0..0]}\$#{ajh.rjust(4,'0')}"
          yxgs=
          yxmc = "#{yxgs[0..-5]}#{ajh.rjust(4,'0')}" 
          path = "#{yxmc}".gsub('$','\$')
          User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dh_prefix}','#{mlh}', 'ruby ./dady/bin/import_image.rb #{dh_prefix} #{path} #{ajh}', '', '', '未开始');")
        end  
      #end
    end  
    render :text => 'Success'
  end
  
  def print_selected_qzxx
    user = User.find_by_sql("select * from q_qzxx where id in (#{params['id']});")
    for k in 0..user.size-1
      dd = user[k]
      ss = dd.dh_prefix.split('-')
      qzh, dalb, mlh = ss[0], ss[1], ss[2]
      User.find_by_sql("insert into q_status (dhp, mlh, cmd, fjcs, dqwz, zt) values ('#{dd.dh_prefix}','#{mlh}', 'ruby ./dady/bin/print_qzxx_tj.rb #{dd.dh_prefix} ', '', '', '未开始');")
    end  
    render :text => 'Success'
  end
  
  def save_archive_info
    ys, dh =  params['ajys'], params['dh']
    User.find_by_sql("update archive set ys=#{ys} where dh='#{dh}';") if !ys.nil?
    #User.find_by_sql("update timage_tj set ajys=#{ys} where dh='#{dh}';") if !ys.nil?
    dd = dh.split('_')
    dh_prefix=dd[0..2].join("-") 
    system("ruby ./dady/bin/update_timage_tj2.rb #{dh_prefix}")
    render :text => 'Success'
  end
  
  #获得角色树
  def get_js_tree
   node, style = params["node"], params['style']
   if node == "root"
     data = User.find_by_sql("select * from  d_js order by id;")
     size=data.size
     if size>0
       text="["
       data.each do |dd|
         text=text+"{'text':'#{dd['jsmc']}','id' :'#{dd['id']}','leaf':true,'checked':false,'iconCls':'user'},"
       end
       text=text + "]"
     else
       text="[]"
     end
     render :text => text
   end
  end
  
  #获得角色列表
  def  get_js_grid
    user = User.find_by_sql("select * from  d_js order by id;")

    size = user.size;
    if size > 0 
     txt = "{results:#{size},rows:["
     for k in 0..user.size-1
       txt = txt + user[k].to_json + ','
     end
     txt = txt[0..-2] + "]}"
    else
     txt = "{results:0,rows:[]}"  
    end  
    render :text => txt
  end
  
  #更新角色信息
  def update_js
   user=User.find_by_sql("select * from d_js where id <> #{params['id']} and jsmc='#{params['jsmc']}';")
   size = user.size
   if size == 0
     User.find_by_sql("update d_js set jsmc='#{params['jsmc']}' where id = #{params['id']};")
     txt='success'
   else
     txt= '角色名称已经存在，请重新输入角色名称。'
   end
   render :text => txt
  end

  #新增角色信息
  def insert_js
    user=User.find_by_sql("select * from d_js where  jsmc='#{params['jsmc']}';")
    size = user.size
    if size == 0
      User.find_by_sql("insert into d_js(jsmc) values ('#{params['jsmc']}');")
      txt='success'
    else
      txt= '角色名称已经存在，请重新输入角色名称。'
    end
    render :text => txt
  end

  #删除角色信息
  def delete_js
    user=User.find_by_sql("delete from d_js where  id=#{params['id']};")


    render :text => 'success'
  end

  #获得用户角色
  def get_user_js
    data = User.find_by_sql("select * from  u_js where userid = '#{params['id']}' order by id;")
    text=""
    data.each do |dd|
      if text==""
        text="#{dd['jsid']}" 
      else
        text=text+"|#{dd['jsid']}" 
      end
    end
    render :text => text      
  end

  #保存用户角色
  def insert_user_js
    User.find_by_sql("delete from u_js where userid = '#{params['userid']}';")
    ss = params['insert_qx'].split('$')
    for k in 0..ss.length-1
      qx=ss[k].split(';')       
      if qx[0]=="root1"  
      else
        User.find_by_sql("insert into u_js(userid, jsid) values ('#{params['userid']}', '#{qx[0]}');")
      end
    end
    render :text => 'success'
  end
    
  #取登录的用户IDid
  def get_userid
    render :text => User.current.id
  end
  
  def balance_mulu
    dh = params['dh']  #'6_0_1'
    User.find_by_sql("update archive set ys=timage_tj.smyx from timage_tj where archive.dh=timage_tj.dh and timage_tj.dh_prefix='#{dh}';")
    system("ruby ./dady/bin/update_timage_tj2.rb #{dh}")
    render :text => 'Success'
  end

end