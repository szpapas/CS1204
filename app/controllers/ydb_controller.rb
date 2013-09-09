class YdbController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :authenticate_user!, :except => []
  before_filter :set_current_user
  
  def index
  end
  
  def get_yd_tree
    text = []
    if params['id'].nil? #root node
      data = User.find_by_sql("select distinct cx from ydb;")
      data.each do |dd|
        text << {:id => "#{dd['cx']}",  :text => dd["cx"], :iconCls  => "icon-folderClose",  :state => "closed" }  
      end

    else 
      node_id = params['id']
      ss = node_id.split('|')
      if ss.size == 1 
        data = User.find_by_sql("select distinct yt from ydb where cx='#{ss[0]}' order by yt;")
        data.each do |dd|
          text << {:id => "#{ss[0]}|#{dd['yt']}",  :text => dd["yt"], :iconCls  => "icon-folderClose",  :state => "closed" }  
        end
      else 
        data = User.find_by_sql("select srf, id from ydb where cx='#{ss[0]}' and yt='#{ss[1]}' order by srf;")
        data.each do |dd|
          text << {:id => "#{dd["id"]}",  :text => dd["srf"], :iconCls  => "icon-map",  :state => "open" }  
        end
      end
    end  

    render :text => text.to_json
  end  
  
  def get_ydb_grid
    cond = []
    
    page = params['page']
    rows = params['rows']
    
    offset = (page.to_i-1)*rows.to_i
    
    cond << "cx  = '#{params['cx']}' "   if params['cx'] != ''
    cond << "yt = '#{params['yt']}' "  if params['yt'] != ''
    cond << "srf like '%#{params['filter']}%' " if params['filter'] != ''
    
    cond_str  = ''
    cond_str = "where " + cond.join(" and ") if cond.size > 0;
    
    total = User.find_by_sql("select count(*) from ydb #{cond_str};")[0].count 
    user = User.find_by_sql("select * from ydb #{cond_str} order by id offset #{offset} limit #{rows};")
    
    render :text => {"total" => total, "rows" => user}.to_json
  end
  
  def ydb_dd
    if params['id'].nil?
      render :template => "error.html.erb"
    else
      #@xmdk = User.find_by_sql("select *, x(transform(centroid(the_geom), 4326)) as lng, y(transform(centroid(the_geom), 4326)) as lat, st_asgeojson(transform(the_geom,4326)) as geom_string from xmdks where gid = #{params['id']};")[0]
      @ydb = User.find_by_sql("select * from ydb where id = #{params['id']}")
      @ydb = @ydb[0] if @ydb != nil
    end
  end
  
  def save_ydb
    
    params['crfapzrq'] = params['crfapzrq'] == '' ? "NULL" : "TIMESTAMP '#{params['crfapzrq']}'"
    params['sjjgsj'] = params['sjjgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjgsj']}'"
    params['ydjgsj'] = params['ydjgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjgsj']}'"
    params['sjjdsj'] = params['sjjdsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjdsj']}'"
    params['ydjdsj'] = params['ydjdsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjdsj']}'"
    params['sjkgsj'] = params['sjkgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['sjkgsj']}'"
    params['gdrq'] = params['gdrq'] == '' ? "NULL" : "TIMESTAMP '#{params['gdrq']}'"
    params['cjrq'] = params['cjrq'] == '' ? "NULL" : "TIMESTAMP '#{params['cjrq']}'"
    params['ggrq'] = params['ggrq'] == '' ? "NULL" : "TIMESTAMP '#{params['ggrq']}'"
    params['qdhtrq'] = params['qdhtrq'] == '' ? "NULL" : "TIMESTAMP '#{params['qdhtrq']}'"
    params['ydkgsj'] = params['ydkgsj'] == '' ? "NULL" : "TIMESTAMP '#{params['ydkgsj']}'"
    params['sjjkrq'] = params['sjjkrq'] == '' ? "NULL" : "TIMESTAMP '#{params['sjjkrq']}'"
    params['ydjkrq'] = params['ydjkrq'] == '' ? "NULL" : "TIMESTAMP '#{params['ydjkrq']}'"
                                                                                              
    if params['ydb_id']=="" 
      user = User.find_by_sql("insert into ydb (cx, gdfs, crfapzrq, ggrq, cjrq, qdhtrq, gdrq, cjqrsbh, htbh, pfwh, crf, srf, lxr, dh, jsxmmc, dkwz, dkbh, zdmj, dkdz, dkxz, dknz, dkbz, pgj, dj_dj, dj_mwj, dj_lmj, cjj_mwj, cjj_lmj, cjzj, yjl, cr, yt, cyml, qsly, tztx, bzj, ydjkrq, sjjkrq, znjqk, qkje, wdqk, cjqk, ydjdsj, sjjdsj, ydkgsj, sjkgsj, ydjgsj, sjjgsj, tze, zczb, rjl, jsmd, lhl, qtyq, kjjzmj, zxtxbl, zxtxmj, bz) values ('#{params['cx']}','#{params['gdfs']}',#{params['crfapzrq']}, #{params['ggrq']},#{params['cjrq']},#{params['qdhtrq']}, #{params['gdrq']},'#{params['cjqrsbh']}','#{params['htbh']}','#{params['pfwh']}','#{params['crf']}','#{params['srf']}','#{params['lxr']}','#{params['dh']}','#{params['jsxmmc']}','#{params['dkwz']}','#{params['dkbh']}','#{params['zdmj']}','#{params['dkdz']}','#{params['dkxz']}','#{params['dknz']}','#{params['dkbz']}','#{params['pgj']}','#{params['dj_dj']}','#{params['dj_mwj']}','#{params['dj_lmj']}','#{params['cjj_mwj']}','#{params['cjj_lmj']}','#{params['cjzj']}','#{params['yjl']}','#{params['cr']}','#{params['yt']}','#{params['cyml']}','#{params['qsly']}','#{params['tztx']}','#{params['bzj']}',#{params['ydjkrq']}, #{params['sjjkrq']},'#{params['znjqk']}','#{params['qkje']}','#{params['wdqk']}','#{params['cjqk']}', #{params['ydjdsj']},  #{params['sjjdsj']},  #{params['ydkgsj']}, #{params['sjkgsj']}, #{params['ydjgsj']}, #{params['sjjgsj']}, '#{params['tze']}','#{params['zczb']}','#{params['rjl']}','#{params['jsmd']}','#{params['lhl']}','#{params['qtyq']}','#{params['kjjzmj']}','#{params['zxtxbl']}','#{params['zxtxmj']}','#{params['bz']}') returning id;")
      ydb_id = user[0]['id']
    else 
      User.find_by_sql("update ydb set cx='#{params['cx']}', gdfs='#{params['gdfs']}',crfapzrq = #{params['crfapzrq']}, ggrq = #{params['ggrq']}, cjrq = #{params['cjrq']}, qdhtrq = #{params['qdhtrq']}, gdrq = #{params['gdrq']}, cjqrsbh = '#{params['cjqrsbh']}', htbh = '#{params['htbh']}', pfwh = '#{params['pfwh']}', crf = '#{params['crf']}', srf = '#{params['srf']}', lxr = '#{params['lxr']}', dh = '#{params['dh']}',jsxmmc = '#{params['jsxmmc']}', dkwz = '#{params['dkwz']}', dkbh = '#{params['dkbh']}', zdmj = '#{params['zdmj']}', dkdz = '#{params['dkdz']}', dkxz = '#{params['dkxz']}', dknz = '#{params['dknz']}', dkbz = '#{params['dkbz']}', pgj='#{params['pgj']}', dj_dj='#{params['dj_dj']}',dj_mwj='#{params['dj_mwj']}',dj_lmj='#{params['dj_lmj']}',cjj_mwj='#{params['cjj_mwj']}',cjj_lmj='#{params['cjj_lmj']}',cjzj='#{params['cjzj']}',yjl='#{params['yjl']}', cr='#{params['cr']}', yt='#{params['yt']}', cyml='#{params['cyml']}', qsly='#{params['qsly']}', tztx='#{params['tztx']}', bzj='#{params['bzj']}', ydjkrq= #{params['ydjkrq']}, sjjkrq = #{params['sjjkrq']}, znjqk='#{params['znjqk']}', qkje='#{params['qkje']}',wdqk='#{params['wdqk']}',cjqk='#{params['cjqk']}',ydjdsj= #{params['ydjdsj']}, sjjdsj = #{params['sjjdsj']}, ydkgsj= #{params['ydkgsj']}, sjkgsj=#{params['sjkgsj']}, ydjgsj= #{params['ydjgsj']}, sjjgsj= #{params['sjjgsj']}, tze='#{params['tze']}',zczb='#{params['zczb']}',rjl='#{params['rjl']}',jsmd='#{params['jsmd']}',lhl='#{params['lhl']}',qtyq='#{params['qtyq']}', kjjzmj= '#{params['kjjzmj']}',zxtxbl='#{params['zxtxbl']}',zxtxmj='#{params['zxtxmj']}',bz='#{params['bz']}'   where id = #{params['ydb_id']};")
      ydb_id = params['ydb_id'].to_i
    end    
    render :text => "#{ydb_id}"
  end
  
  
  def jsyd_pdf
    ydb_id = params['id']
    puts("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    system("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    render :text => "/images/dady/yd_xkz/jsyd_#{ydb_id}.pdf"
  end
  
  def jsyd_pdf2
    ydb_id = params['id']
    puts("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    system("ruby ./dady/bin/pdf_jsyd.rb #{ydb_id}")
    redirect_to "/images/dady/yd_xkz/jsyd_#{ydb_id}.pdf"
  end  
  
end
