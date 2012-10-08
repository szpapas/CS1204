# encoding: utf-8
require 'socket'
require 'find'
require 'date'

class DesktopController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!, :except => [:get_plan_json,  :get_plan_list, :get_inspect_json, :get_2dinfo, :batch_report_pos, :report_task_state, :get_task_position, :upload_pic2, :report_current_pos, :report_iphone_pos, :get_product, :get_archive_where, :check_result, :report_line_pos, :get_track_points, :get_xmdk_json, :get_task_line, :add_new_xmdk, :get_task_inspect]
  
  
  before_filter :set_current_user
  
  def index
  end
  
  def week_dates( week_num )
      year = Time.now.year
      week_start = Date.commercial( year, week_num, 1 )
      week_end = Date.commercial( year, week_num, 7 )
      week_start.strftime( "%m/%d/%y" ) + ' - ' + week_end.strftime( "%m/%d/%y" )
  end
  
  #add at 06/17 
  #Create Line From Points
  def upldate_line(session_id)
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
    if id.nil? || id == ''
    else
      User.find_by_sql("update plans set xcqy= '#{params['xcqy']}', xclx = '#{params['xclx']}', xcry='#{params['xcry']}', xcfs='#{params['xcfs']}', xcnr='#{params['xcnr']}', xmdk='#{params['xmdk']}', qrq=TIMESTAMP '#{qrq}', zrq=TIMESTAMP '#{zrq}', xcjg= '#{params['xcjg']}', clyj='#{params['clyj']}' where id = #{params['id']};")
    end
    
    render :text => 'Success'
  end
  
  def delete_selected_plan
    if params['id'] == 'all'
      User.find_by_sql("delete from plans where zt='计划';")
      #User.find_by_sql('delete from inspects;')
    else  
      User.find_by_sql("delete from plans where id in (#{params['id']});")
      User.find_by_sql("delete from inspects where plan_id in (#{params['id']});") 
    end
    render :text => 'Success'
  end  
  
  def delete_all_plan
    User.find_by_sql("delete from plans;")
    User.find_by_sql("delete from inspects;") 
    render :text => 'Success'
  end
  
  def get_plan
    params['start'] = params['start'] || "0"
    params['limit'] = params['limit'] || "25"
    params['xcqy']  = params['xcqy'] || "全部"
    params['xcfs']  = params['xcfs'] || "全部"
    params['zt']    = params['zt'] || "全部"
    params['filter'] = params['filter'] || "全部"
    
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
  
  def get_user
    render :text => User.current.to_json
  end
  
  def print_selected_plan
    user = User.find_by_sql("select * from plans where id in (#{params['id']});")
    for k in 0..user.size-1
      puts "ruby ./dady/bin/print_plan.rb #{user[k].id}"
      system("ruby ./dady/bin/print_plan.rb #{user[k].id}")
    end
    render :text => "/images/dady/images/#{user[0].xcbh}-01.png"
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
    
    #Create_Line from points
    upldate_line(session_id)
    render :text => 'Success'
  end
  
  
  def get_ygtree
    text = []
    node = params["node"].chomp
    if node == "root"
      if !params['filter'].nil?
        data = User.find_by_sql("select distinct dw from users where username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%' ;")
      else
        data = User.find_by_sql("select distinct dw from users;")
      end
      
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder"}
      end
    else
      pars = node.split('|') || []
  
      if pars.length == 1
        if pars[0]=='常熟市局'
            if !params['filter'].nil?
              data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}' and (username like '%#{params['filter']}%' or uname like  '%#{params['filter']}%') ;")
            else
              data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}';")
            end
            data.each do |dd|
            text << {:text => dd["bm"], :id => pars[0]+"|#{dd["bm"]}", :iconCls => "folder"}
          end     
        else 
          if !params['filter'].nil?
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and (username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%') order by uname;")
          else
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' order by uname;")
          end
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
        end
      end
      
      if pars.length == 2
          if !params['filter'].nil?
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' and (username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%') order by uname ;")
          else
            data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' order by uname;")
          end
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
      end
    end
    render :text => text.to_json
  end
  
  def get_detail_user
    user = User.find_by_sql("select * from users where username='#{params['name']}';");
    render :text => user[0].to_json
  end
  
  #add at 04/29
  
  def get_xcry(xcqy)
    if xcqy=='常熟市局'
      user = User.find_by_sql("select username from users where bm='国土资源监察大队' limit 10;")
    else
      user = User.find_by_sql("select username from users where dw='#{xcqy}' limit 10;")
    end
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
  
  
  def add_zhxc_twice_per_week(xcqy, nd)  
    data = User.find_by_sql("select distinct dw, dwjc from users where dw='#{xcqy}';")
    xcry = get_xcry(xcqy)
    #w_begin = Date.new(nd,month,1).strftime('%U').to_i
    w_begin = Time.now.strftime('%U').to_i
    for week in w_begin+1..w_begin+8
      week_start = Date.commercial(nd, week, 1)
      week_end   = Date.commercial(nd, week, 7 )
      xcbh = "xc-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-01"
      rwmc = "#{data[0]['dw']} #{nd}年#{week}周 第1次巡查"
      session_id =rand(36**32).to_s(36)
      qrq = week_start.strftime( "%Y-%m-%d" ) 
      zrq = week_end.strftime( "%Y-%m-%d" )
      User.find_by_sql "insert into plans (xcbh, rwmc, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{rwmc}','#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')" 
      xcbh = "xc-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-02"
      rwmc = "#{data[0]['dw']} #{nd}年#{week}周 第2次巡查"
      session_id =rand(36**32).to_s(36)
      qrq = week_start.strftime( "%Y-%m-%d" ) 
      zrq = week_end.strftime( "%Y-%m-%d" )
      User.find_by_sql "insert into plans (xcbh, rwmc, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{rwmc}','#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')"
    end
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
    when '1周2次'
      for week in 1..52
        week_start = Date.commercial(nd, week, 1)
        week_end   = Date.commercial(nd, week, 7 )
        xcbh = "xc-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-01"
        session_id =rand(36**32).to_s(36)
        qrq = week_start.strftime( "%Y-%m-%d" ) 
        zrq = week_end.strftime( "%Y-%m-%d" )
        User.find_by_sql "insert into plans (xcbh, session_id, zt, qrq, zrq, xcqy, xcfs, xcry) values ('#{xcbh}', '#{session_id}', '计划',  TIMESTAMP '#{qrq}',  TIMESTAMP '#{zrq}', '#{xcqy}', '综合巡查', '#{xcry}')" 
        xcbh = "xc-#{data[0].dwjc}-w#{week.to_s.rjust(2,'0')}-02"
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
        xqzmc = user[k].dw
        #add_zhxc_single(xqzmc, nd, pd)
        add_zhxc_twice_per_week(xqzmc, nd)
      end  
    else 
      add_zhxc_twice_per_week(xqzmc, nd)
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

  # get all current_active user postion, 当前Area内的。
  def get_user_position
    user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL;")
    render :text => user.to_json
  end
  
  #add at 06/08
  def get_task_position
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where id=#{params['task_id']} order by report_at desc;")

    render :text => user.to_json
  end
  
  def get_task_position_over
    user = User.find_by_sql("select id, astext(the_lines) as lon_lat, username, device, report_at, session_id from plans where zt='完成' order by report_at desc;")

    render :text => user.to_json
  end
  
  #====add at 05/04
  def get_phone_list
    zt = params['zt'] || '执行'
    if zt == '执行'
      user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, device, session_id, report_at, zt from plans where zt='执行';")
    else
      user = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL;")
    end    
    size = user.count.to_i;
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
  
  def upload_pic2
    
    logger.debug("========filename: #{params['value1']} ")
    
    task_id = params['task_id'].to_i
    session_id = params['session_id']
    inspect_id = params['inspect_id']
    pic_name = params['image_name']+'.jpg'

    params.each do |k,v|
      #logger.debug("#{k} , #{v}")
      if k.include?("image_file")
        logger.debug("#{v.path}")
        yxpath = "./dady/xctp/#{task_id}/#{inspect_id}"
        system("mkdir -p #{yxpath}") if !File.exists?(yxpath)
        system("cp #{v.path} #{yxpath}/#{pic_name}")
        system("chmod 644 #{yxpath}/#{pic_name}")
        logger.debug("./dady/bin/save_image.rb #{yxpath}  #{pic_name} #{params['tpjd']} #{params['tpbz']} #{inspect_id}  #{task_id} ")
        system("ruby ./dady/bin/save_image.rb #{yxpath}  #{pic_name} #{params['tpjd']} #{params['tpbz']} #{inspect_id}  #{task_id} ")
      end
      
    end
    render :text => "Success"
  end
  
  def change_password
    if params['password_confirmation'] == params['password']
      User.current.password = params['password']
      User.current.password_confirmation=params['password']
      User.current.save
      render :text => 'Success'
    else
      render :text => 'Falied'
    end
  end  
  
  #change at 05/13
  def  get_user_grid
    filter = params['filter']
    ss = filter.split('|')
    if ss.size == 1 
       user = User.find_by_sql("select * from  users where dw = '#{ss[0]}' order by id;")
    elsif ss.size == 2
       user = User.find_by_sql("select * from  users where dw = '#{ss[0]}' and bm = '#{ss[1]}' order by id;")
    else 
      user = User.find_by_sql("select * from  users order by id;")
    end
      
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
  
  def add_user
    if !params['id'].nil? && params['id'] != ''  
      User.find_by_sql("update users set qxcode='#{params['qxcode']}', hide='#{params['hide']}', email='#{params['email']}', username='#{params['username']}', bgdh='#{params['bgdh']}', bm='#{params['bm']}', iphone='#{params['iphone']}' where id=#{params['id']}; ")
    else
      User.find_by_sql("insert into users (username, email, qxcode, bm, bgdh, iphone) values('#{params['username']}','#{params['email']}', '#{params['qxcode']}', '#{params['bm']}', '#{params['bgdh']}', '#{params['iphone']}'); ")
    end  
    render :text => 'Success'
  end 
  
  def delete_selected_user
    User.find_by_sql("delete from users where id in (#{params['id']});")
    render :text => 'Success'
  end
  
  def reset_password
    ss=params['id'].split(',')
    for k in 0..ss.size-1
      user = User.find(ss[k].to_i)
      puts user.username
      user.password='123!@#'
      user.password_confirmation='123!@#'
      user.save
    end  
    render :text => 'Success'
  end
  
  #==================
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
  
  #add at 06/06
  def get_yhtree
    text = []
    node = params["node"].chomp
    if node == "root"
      data = User.find_by_sql("select distinct dw from users;")
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder"}
      end
    else
      pars = node.split('|') || []
  
      if pars.length == 1
        if pars[0]=='常熟市局'
            data = User.find_by_sql("select distinct bm from users where dw='#{pars[0]}';")
            data.each do |dd|
            text << {:text => dd["bm"], :id => pars[0]+"|#{dd["bm"]}", :iconCls => "folder"}
          end     
        else 
          data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' order by uname;")
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
        end
      end
      
      if pars.length == 2
          data = User.find_by_sql("select distinct username, bgdh, iphone, uname from users where dw='#{pars[0]}' and bm='#{pars[1]}' order by uname;")
          data.each do |dd|
          text << {:text => dd["username"], :id => pars[0]+"|#{dd["username"]}|#{dd['bgdh']}", :iconCls => "user",  :leaf => true}
        end     
      end
    end
    render :text => text.to_json
  end
  
  #add on 06/09
  def get_bmtree
    text = []
    node = params["node"].chomp
    if node == "root"
      if !params['filter'].nil?
        data = User.find_by_sql("select distinct dw from users where username like  '%#{params['filter']}%' or  uname like  '%#{params['filter']}%';")
      else
        data = User.find_by_sql("select distinct dw from users where dw IS NOT NULL order by dw;")
      end
      
      data.each do |dd|
        text << {:text => dd["dw"], :id => dd["dw"], :cls  => "folder", :leaf => true}
      end
    end
    render :text => text.to_json 
  
  end  
  
  def uploadfiles
    params.each do |k,v|
      logger.debug("#{k} , #{v}")
    end
    
    fs = params['fileselect']
    for k in 0..fs.size - 1 
      ff = fs[k]
      puts "#{ff.content_type}\t#{ff.original_filename}"
    end 
    
    render :text => 'Success'
  end
  
  #add on 06/12
  def display_selected_plan
    user = User.find_by_sql("select * from plans where id=#{params['id']};")[0]
    rand_file="./public/static/zfjc/zfjc_#{rand(36**32).to_s(36)}.html"
    
    pics = User.find_by_sql("select id, yxmc, rq, tpjd, bz, xmdk_id, plan_id from xcimage where plan_id=#{params['id']};")
    
    image_url = ""
    for pp in 0..pics.size-1
      dd = pics[pp]
      imgPath = "/images/dady/xctp/#{dd['plan_id']}/#{dd['xmdk_id']}/#{dd['yxmc']}"
      image_url = image_url + "<img src=\"#{imgPath}\" width=\"280\" alt=\"\"> &nbsp;&nbsp;"
    end  
   
    ss=File.open('./public/static/zfjc/xcmb.tpl.html').read.gsub("{TAG_XCSJ}","#{user.report_at}").gsub("{TAG_XCLX}","#{user.xclx}").gsub("{TAG_XCRY}","#{user.xcry}").gsub("{TAG_XCFS}","#{user.xcfs}").gsub("{TAG_XCNR}","#{user.xcnr}").gsub("{TAG_XCJG}","#{user.xcjg}").gsub("{TAG_CLYYJG}","#{user.clyj}").gsub("{TAG_IMGS}",image_url).gsub("{XC_DATE}","#{user.taskendtime}").gsub("{SESSION_ID}", user.session_id)
    
    ff = File.open("#{rand_file}",'w+')
    ff.write(ss)
    ff.close
    render :text=>rand_file.gsub("./public/",'/')
  end
  
  def get_report
    params['start'] = params['start'] || "0"
    params['limit'] = params['limit'] || "25"
    params['nd']    = params['nd'] || "全部"
    params['zt']    = params['zt'] || "全部"
    params['filter'] = params['filter'] || "全部"
    
    cond=[]
    cond << "zt='#{params['zt']}'" if params['zt'] != '全部'
    cond << "nd='#{params['nd']}'" if params['nd'] != '全部'
    
    if params['filter'] != '全部'
      ff = params['filter'].split('|')
      if ff.size == 2 
        cond << "tbdw='#{ff[0]}'"
        cond << "lb='#{ff[1]}'" 
      else 
        cond << "tbdw='#{ff[0]}'"
      end    
    end
    
    case cond.size
    when 0
        conds = ''
    when 1
        conds = "where #{cond[0]}"
    else
        conds = "where #{cond.join(' and ')}"
    end
    
    user = User.find_by_sql("select count(*) from reports #{conds} ;")[0]
    size = user.count.to_i;
    if size > 0
      txt = "{results:#{size},rows:["
      puts "select * from reports #{conds} limit #{params['limit']} offset #{params['start']};"
      user = User.find_by_sql("select * from reports #{conds} limit #{params['limit']} offset #{params['start']};")
      for k in 0..user.size-1
        txt = txt + user[k].to_json + ','
      end
      txt = txt[0..-2] + "]}"
    else
      txt = "{results:0,rows:[]}"
    end
    render :text => txt
  end
  
  #add on 06/11
  def get_rptree
    text = []
    node = params["node"].chomp
    params['lb'] = params['lb'] || "bm"
    
    if params['lb'] == "bm"
      if node == "root"
        data = User.find_by_sql("select distinct tbdw from reports order by tbdw;")
        data.each do |dd|
          text << {:text => dd["tbdw"], :id => dd["tbdw"], :cls  => "folder"}
        end
      else
        #more info
        data = User.find_by_sql("select distinct lb from reports where tbdw = '#{node}' order by lb;")
        data.each do |dd|
          text << {:text => dd["lb"], :id => "#{node}|#{dd["lb"]}", :iconCls => "text",  :leaf => true}
        end
      end
    else  #time
      if node == "root"
        data = User.find_by_sql("select distinct lb from reports order by lb;")
        data.each do |dd|
          text << {:text => dd["lb"], :id => dd["lb"], :cls  => "folder"}
        end
      else
        #more info 
      end  
    end    
    render :text => text.to_json 
  
  end
  
  def delete_selected_report
    if params['id'] == 'all'
      User.find_by_sql("delete from reports where zt='计划';")
    else  
      User.find_by_sql("delete from reports where id in (#{params['id']});")
    end
    render :text => 'Success'
  end
  
  #add at 06/14
  def add_report
    id = params['id']
    if id.nil? || id == ''
      User.find_by_sql("insert into reports (nd, lb, yf, xh, tbdw, tbr, bgnr, zt) values ('#{params['nd']}','#{params['lb']}','#{params['yf']}','#{params['xh']}','#{params['tbdw']}','#{User.current.username}','#{params['bgnr']}','未提交');")
    else  
      User.find_by_sql("update reports set nd='#{params['nd']}',  lb='#{params['lb']}',yf='#{params['yf']}',xh='#{params['xh']}',tbdw='#{params['tbdw']}',bgnr='#{params['bgnr']}' where id = #{params['id']};")
    end
    render :text => 'Success'
  end  
  
  def commit_selected_report
     ts1 = Time.now.strftime('%Y-%m-%d') 
     User.find_by_sql("update reports set zt='已提交', commit_at = TIMESTAMP '#{ts1}'  where id in (#{params['id']});")
     render :text => 'Success'
  end

  #路线回放点
  def get_track_points
	  user = User.find_by_sql("select astext(the_lines) from plans where id=#{params['task_id']};")
	  if user.size > 0
	    txt = user[0].astext[11..-2]
	  else 
	    txt = ''
	  end     
	  render :text => txt
	end
 
  # 部门， 人员， 路线
  #
  def get_phone_tree
    text = []
    node = params["node"]
    
    if node == "root"
      data = User.find_by_sql("select distinct dw from users where dw is not null;")
      data.each do |dd|
        text << {:text => " #{dd['dw']}", :id => "#{dd["dw"]}", :cls => "folder" }
      end
    else
      pars = node.split('|') || []
      
      if pars.length == 1
        data = User.find_by_sql("select id, astext(the_points) as lon_lat, username, iphone as device, last_seen as report_at, (now() + interval '7 hour') < last_seen as zt from users where last_seen is not NULL and dw = '#{pars[0]}';")
        data.each do |dd|
          if dd['zt'] == 'f'
            text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "offline", :checked => false}
          else
            text << {:text => " #{dd['username']}", :id => "#{dd["username"]}|#{dd['lon_lat']}", :cls => "folder", :iconCls => "online", :checked => false}
          end    
        end
      elsif pars.length == 2
        data = User.find_by_sql("select id, rwmc as xcmc, zt, astext(the_lines) as the_lines, report_at  from plans where xcry like '%#{pars[0]}%' and the_lines is not null order by report_at;")
        data.each do |dd|
            text << {:text => "#{dd['xcmc']}", :id => "#{dd["id"]}|#{dd["zt"]}|#{dd['report_at']}", :leaf => true, :cls => "file", :checked => false}
        end
      end
    end
    render :text => text.to_json
  end
  
  
  
end